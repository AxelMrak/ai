import { mkdir, readdir, rm, stat } from "node:fs/promises";
import { join, dirname } from "path";

const SKILLS_ROOT = join(import.meta.dir, "..");
const SOURCES_FILE = join(SKILLS_ROOT, "_sources.json");
const GITHUB_API = "https://api.github.com";
const GITHUB_RAW = "https://raw.githubusercontent.com";

interface SkillSource {
  repo: string;
  path: string;
  branch: string;
  preserve?: string[];
}

interface SourcesConfig {
  sources: Record<string, SkillSource>;
}

interface GitHubContent {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

async function loadSources(): Promise<SourcesConfig> {
  const file = Bun.file(SOURCES_FILE);
  return await file.json();
}

async function fetchGitHubContents(
  repo: string,
  path: string,
  branch: string
): Promise<GitHubContent[]> {
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "axelmrak-skills-sync",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return await response.json();
}

async function fetchFileContent(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${url}`);
  }
  return await response.text();
}

function matchesPattern(filename: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    const regex = new RegExp(
      "^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$"
    );
    if (regex.test(filename)) {
      return true;
    }
  }
  return false;
}

async function getExistingFiles(dir: string): Promise<Set<string>> {
  const files = new Set<string>();
  try {
    const entries = await readdir(dir, { recursive: true });
    for (const entry of entries) {
      files.add(entry);
    }
  } catch {
    // Directory doesn't exist yet
  }
  return files;
}

async function syncSkillDirectory(
  repo: string,
  remotePath: string,
  localPath: string,
  branch: string,
  preserve: string[],
  existingFiles: Set<string>,
  relativePath: string = ""
): Promise<{ added: string[]; updated: string[]; preserved: string[] }> {
  const result = { added: [] as string[], updated: [] as string[], preserved: [] as string[] };

  await mkdir(localPath, { recursive: true });

  const contents = await fetchGitHubContents(repo, remotePath, branch);

  for (const item of contents) {
    const localItemPath = join(localPath, item.name);
    const relativeItemPath = relativePath ? `${relativePath}/${item.name}` : item.name;

    if (item.type === "dir") {
      const subResult = await syncSkillDirectory(
        repo,
        item.path,
        localItemPath,
        branch,
        preserve,
        existingFiles,
        relativeItemPath
      );
      result.added.push(...subResult.added);
      result.updated.push(...subResult.updated);
      result.preserved.push(...subResult.preserved);
    } else if (item.type === "file" && item.download_url) {
      if (matchesPattern(relativeItemPath, preserve)) {
        result.preserved.push(relativeItemPath);
        continue;
      }

      const content = await fetchFileContent(item.download_url);
      const exists = existingFiles.has(relativeItemPath);

      await Bun.write(localItemPath, content);

      if (exists) {
        result.updated.push(relativeItemPath);
      } else {
        result.added.push(relativeItemPath);
      }
    }
  }

  return result;
}

async function cleanOrphanedFiles(
  skillDir: string,
  preserve: string[],
  remoteFiles: Set<string>
): Promise<string[]> {
  const removed: string[] = [];
  const localFiles = await getExistingFiles(skillDir);

  for (const file of localFiles) {
    if (!remoteFiles.has(file) && !matchesPattern(file, preserve)) {
      const filePath = join(skillDir, file);
      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          await rm(filePath);
          removed.push(file);
        }
      } catch {
        // File might have been removed already
      }
    }
  }

  return removed;
}

async function syncSkill(
  skillName: string,
  source: SkillSource
): Promise<void> {
  const skillDir = join(SKILLS_ROOT, skillName);
  const preserve = source.preserve || [];

  console.log(`\n  Syncing ${skillName}...`);
  console.log(`    Source: ${source.repo}/${source.path}`);

  const existingFiles = await getExistingFiles(skillDir);

  const result = await syncSkillDirectory(
    source.repo,
    source.path,
    skillDir,
    source.branch,
    preserve,
    existingFiles
  );

  if (result.added.length > 0) {
    console.log(`    Added: ${result.added.length} files`);
  }
  if (result.updated.length > 0) {
    console.log(`    Updated: ${result.updated.length} files`);
  }
  if (result.preserved.length > 0) {
    console.log(`    Preserved (custom): ${result.preserved.length} files`);
  }

  if (result.added.length === 0 && result.updated.length === 0) {
    console.log(`    Already up to date`);
  }
}

async function main() {
  console.log("Syncing external skills...\n");

  const config = await loadSources();
  const skillNames = Object.keys(config.sources);

  console.log(`Found ${skillNames.length} external skill sources:`);
  for (const name of skillNames) {
    console.log(`  - ${name} (${config.sources[name].repo})`);
  }

  for (const [skillName, source] of Object.entries(config.sources)) {
    try {
      await syncSkill(skillName, source);
    } catch (error) {
      console.error(`  Failed to sync ${skillName}:`, error instanceof Error ? error.message : String(error));
    }
  }

  console.log("\nSync complete!");
  console.log("\nTip: Run 'bun run skills/_scripts/build.ts' to rebuild SKILL.md files.");
}

main().catch(console.error);
