import { mkdir, readdir, rm, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")
const SOURCES_FILE = join(SKILLS_ROOT, "_sources.json")
const GITHUB_API = "https://api.github.com"

interface SkillSource {
  repo: string
  path: string
  branch: string
  pinned_ref?: string
  preserve?: string[]
  cleanup?: boolean
  trusted?: boolean
  last_verified?: string
}

interface SourcesConfig {
  defaults?: {
    cleanup?: boolean
    trusted?: boolean
  }
  sources: Record<string, SkillSource>
}

interface GitHubContent {
  name: string
  path: string
  type: "file" | "dir"
  download_url: string | null
}

interface SyncResult {
  added: number
  updated: number
  preserved: number
  removed: number
}

async function loadSources(): Promise<SourcesConfig> {
  return await Bun.file(SOURCES_FILE).json()
}

async function fetchGitHubContents(repo: string, path: string, ref: string): Promise<GitHubContent[]> {
  const url = `${GITHUB_API}/repos/${repo}/contents/${path}?ref=${ref}`
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "skills-sync",
    },
  })

  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
  return await response.json()
}

async function fetchFile(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch: ${url}`)
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
    for (const entry of entries) {
      const entryPath = join(dir, entry)
      const entryStat = await stat(entryPath)
      if (entryStat.isFile()) files.add(entry)
    }
  } catch {
    return files
  }
  return files
}

async function syncDirectory(
  repo: string,
  remotePath: string,
  localPath: string,
  ref: string,
  preserve: string[],
  existingFiles: Set<string>,
  syncedFiles: Set<string>,
  relativePath = ""
): Promise<SyncResult> {
  const result: SyncResult = { added: 0, updated: 0, preserved: 0, removed: 0 }

  await mkdir(localPath, { recursive: true })
  const contents = await fetchGitHubContents(repo, remotePath, ref)

  for (const item of contents) {
    const localItemPath = join(localPath, item.name)
    const relativeItemPath = relativePath ? `${relativePath}/${item.name}` : item.name

    if (item.type === "dir") {
      const sub = await syncDirectory(repo, item.path, localItemPath, ref, preserve, existingFiles, syncedFiles, relativeItemPath)
      result.added += sub.added
      result.updated += sub.updated
      result.preserved += sub.preserved
      result.removed += sub.removed
      continue
    }

    if (item.type === "file" && item.download_url) {
      syncedFiles.add(relativeItemPath)

      if (matchesPattern(relativeItemPath, preserve)) {
        result.preserved++
        continue
      }

      const content = await fetchFile(item.download_url)
      const exists = existingFiles.has(relativeItemPath)
      await Bun.write(localItemPath, content)

      if (exists) result.updated++
      else result.added++
    }
  }

  return result
}

async function removeStaleFiles(skillDir: string, preserve: string[], existingFiles: Set<string>, syncedFiles: Set<string>): Promise<number> {
  let removed = 0
  for (const file of existingFiles) {
    if (syncedFiles.has(file)) continue
    if (matchesPattern(file, preserve)) continue

    await rm(join(skillDir, file), { force: true })
    removed++
  }
  return removed
}

async function syncSkill(skillName: string, source: SkillSource, defaults: SourcesConfig["defaults"]): Promise<void> {
  const skillDir = join(SKILLS_ROOT, skillName)
  const preserve = source.preserve || []
  const ref = source.pinned_ref || source.branch
  const cleanup = source.cleanup ?? defaults?.cleanup ?? true

  console.log(`\nSyncing ${skillName} from ${source.repo}@${ref}...`)
  if (!source.trusted && !(defaults?.trusted ?? false)) {
    console.log("  Warning: untrusted source, review changes after sync")
  }

  const existingFiles = await getExistingFiles(skillDir)
  const syncedFiles = new Set<string>()

  const result = await syncDirectory(source.repo, source.path, skillDir, ref, preserve, existingFiles, syncedFiles)
  if (cleanup) {
    result.removed = await removeStaleFiles(skillDir, preserve, existingFiles, syncedFiles)
  }

  if (result.added > 0) console.log(`  Added: ${result.added} files`)
  if (result.updated > 0) console.log(`  Updated: ${result.updated} files`)
  if (result.removed > 0) console.log(`  Removed stale: ${result.removed} files`)
  if (result.preserved > 0) console.log(`  Preserved: ${result.preserved} custom files`)
  if (result.added === 0 && result.updated === 0 && result.removed === 0) {
    console.log("  Already up to date")
  }
}

async function main() {
  console.log("Syncing external skills...")

  const config = await loadSources()
  const skills = Object.keys(config.sources)

  console.log(`\nFound ${skills.length} sources:`)
  for (const name of skills) console.log(`  - ${name}`)

  for (const [name, source] of Object.entries(config.sources)) {
    try {
      await syncSkill(name, source, config.defaults)
    } catch (error) {
      console.error(`  Failed: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log("\nDone.")
  console.log("Next: bun run skills/_scripts/validate-skills.ts && bun run skills/_scripts/generate-index.ts")
}

main().catch(console.error)
