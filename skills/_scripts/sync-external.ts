import { mkdir, readdir, rm, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")
const SOURCES_FILE = join(SKILLS_ROOT, "_sources.json")
const GITHUB_API = "https://api.github.com"

interface SkillSource {
  repo: string
  path: string
  branch: string
  preserve?: string[]
}

interface SourcesConfig {
  sources: Record<string, SkillSource>
}

interface GitHubContent {
  name: string
  path: string
  type: "file" | "dir"
  download_url: string | null
}

async function loadSources(): Promise<SourcesConfig> {
  return await Bun.file(SOURCES_FILE).json()
}

async function fetchGitHubContents(repo: string, path: string, branch: string): Promise<GitHubContent[]> {
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${branch}`
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "skills-sync",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return await response.json()
}

async function fetchFile(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`)
  }
  return await response.text()
}

function matchesPattern(filename: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$")
    return regex.test(filename)
  })
}

async function getExistingFiles(dir: string): Promise<Set<string>> {
  const files = new Set<string>()
  try {
    const entries = await readdir(dir, { recursive: true })
    entries.forEach((e) => files.add(e))
  } catch {}
  return files
}

async function syncDirectory(
  repo: string,
  remotePath: string,
  localPath: string,
  branch: string,
  preserve: string[],
  existingFiles: Set<string>,
  relativePath = ""
): Promise<{ added: number; updated: number; preserved: number }> {
  const result = { added: 0, updated: 0, preserved: 0 }

  await mkdir(localPath, { recursive: true })
  const contents = await fetchGitHubContents(repo, remotePath, branch)

  for (const item of contents) {
    const localItemPath = join(localPath, item.name)
    const relativeItemPath = relativePath ? `${relativePath}/${item.name}` : item.name

    if (item.type === "dir") {
      const sub = await syncDirectory(repo, item.path, localItemPath, branch, preserve, existingFiles, relativeItemPath)
      result.added += sub.added
      result.updated += sub.updated
      result.preserved += sub.preserved
    } else if (item.type === "file" && item.download_url) {
      if (matchesPattern(relativeItemPath, preserve)) {
        result.preserved++
        continue
      }

      const content = await fetchFile(item.download_url)
      const exists = existingFiles.has(relativeItemPath)

      await Bun.write(localItemPath, content)
      exists ? result.updated++ : result.added++
    }
  }

  return result
}

async function syncSkill(skillName: string, source: SkillSource): Promise<void> {
  const skillDir = join(SKILLS_ROOT, skillName)
  const preserve = source.preserve || []

  console.log(`\nSyncing ${skillName} from ${source.repo}...`)

  const existingFiles = await getExistingFiles(skillDir)
  const result = await syncDirectory(source.repo, source.path, skillDir, source.branch, preserve, existingFiles)

  if (result.added > 0) console.log(`  Added: ${result.added} files`)
  if (result.updated > 0) console.log(`  Updated: ${result.updated} files`)
  if (result.preserved > 0) console.log(`  Preserved: ${result.preserved} custom files`)
  if (result.added === 0 && result.updated === 0) console.log(`  Already up to date`)
}

async function main() {
  console.log("Syncing external skills...")

  const config = await loadSources()
  const skills = Object.keys(config.sources)

  console.log(`\nFound ${skills.length} sources:`)
  skills.forEach((name) => console.log(`  - ${name}`))

  for (const [name, source] of Object.entries(config.sources)) {
    try {
      await syncSkill(name, source)
    } catch (error) {
      console.error(`  Failed: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log("\nDone. Run build.ts to rebuild SKILL.md files.")
}

main().catch(console.error)
