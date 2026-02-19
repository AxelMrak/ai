import { readdir, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")
const SOURCES_FILE = join(SKILLS_ROOT, "_sources.json")
const SOURCES_SCHEMA_FILE = join(SKILLS_ROOT, "sources.schema.json")
const CANONICAL_FILE = join(SKILLS_ROOT, "_canonical.json")

interface SkillSource {
  repo: string
  path: string
  branch: string
}

interface SourcesConfig {
  sources: Record<string, SkillSource>
}

interface CanonicalRule {
  preferred: string
  aliases?: string[]
}

interface CanonicalConfig {
  by_name?: Record<string, CanonicalRule>
}

interface SkillScan {
  id: string
  path: string
  hasSkillMd: boolean
  name?: string
  description?: string
}

function parseFrontmatter(content: string): { name?: string; description?: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}

  const lines = frontmatterMatch[1].split("\n")
  const result: { name?: string; description?: string } = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!m) continue

    const key = m[1]
    const raw = m[2].trim()

    if (raw === ">" || raw === "|") {
      const blocks: string[] = []
      i++
      while (i < lines.length && /^\s+/.test(lines[i])) {
        blocks.push(lines[i].trim())
        i++
      }
      i--
      const value = blocks.join(" ").trim()
      if (key === "name") result.name = value
      if (key === "description") result.description = value
      continue
    }

    const value = raw.replace(/^['"]|['"]$/g, "").trim()
    if (!value) continue
    if (key === "name") result.name = value
    if (key === "description") result.description = value
  }

  return result
}

function parseArgs(argv: string[]): { strict: boolean } {
  return { strict: argv.includes("--strict") }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const errors: string[] = []
  const warnings: string[] = []

  const schemaExists = await Bun.file(SOURCES_SCHEMA_FILE).exists()
  if (!schemaExists) errors.push("Missing sources schema: skills/sources.schema.json")

  const sources = (await Bun.file(SOURCES_FILE).json()) as SourcesConfig
  const canonical = (await Bun.file(CANONICAL_FILE).json()) as CanonicalConfig

  const entries = await readdir(SKILLS_ROOT)
  const scans: SkillScan[] = []

  for (const entry of entries) {
    if (entry.startsWith("_") || entry.startsWith(".")) continue

    const entryPath = join(SKILLS_ROOT, entry)
    const entryStat = await stat(entryPath)
    if (!entryStat.isDirectory()) continue

    const skillMdPath = join(entryPath, "SKILL.md")
    const hasSkillMd = await Bun.file(skillMdPath).exists()

    const scan: SkillScan = {
      id: entry,
      path: entryPath,
      hasSkillMd,
    }

    if (hasSkillMd) {
      const content = await Bun.file(skillMdPath).text()
      const fm = parseFrontmatter(content)
      scan.name = fm.name
      scan.description = fm.description
    }

    scans.push(scan)
  }

  for (const scan of scans) {
    if (!scan.hasSkillMd) {
      errors.push(`Missing SKILL.md in skills/${scan.id}`)
      continue
    }

    if (!scan.name) errors.push(`Missing frontmatter name in skills/${scan.id}/SKILL.md`)
    if (!scan.description) errors.push(`Missing frontmatter description in skills/${scan.id}/SKILL.md`)
  }

  const nameToIds = new Map<string, string[]>()
  for (const scan of scans) {
    if (!scan.name) continue
    if (!nameToIds.has(scan.name)) nameToIds.set(scan.name, [])
    nameToIds.get(scan.name)?.push(scan.id)
  }

  for (const [name, ids] of nameToIds.entries()) {
    if (ids.length < 2) continue

    const canonicalRule = canonical.by_name?.[name]
    if (!canonicalRule) {
      errors.push(`Duplicate frontmatter name \`${name}\` without canonical rule: ${ids.join(", ")}`)
      continue
    }

    const allowed = new Set([canonicalRule.preferred, ...(canonicalRule.aliases || [])])
    const unknown = ids.filter((id) => !allowed.has(id))
    if (unknown.length > 0) {
      errors.push(`Canonical rule for \`${name}\` does not include: ${unknown.join(", ")}`)
    }
  }

  for (const sourceName of Object.keys(sources.sources || {})) {
    const dir = join(SKILLS_ROOT, sourceName)
    try {
      const dirStat = await stat(dir)
      if (!dirStat.isDirectory()) {
        errors.push(`Source mapped directory is not a folder: skills/${sourceName}`)
        continue
      }
      const hasSkillMd = await Bun.file(join(dir, "SKILL.md")).exists()
      if (!hasSkillMd) errors.push(`Source mapped skill missing SKILL.md: skills/${sourceName}`)
    } catch {
      errors.push(`Source mapped directory not found: skills/${sourceName}`)
    }
  }

  if (!sources.sources || Object.keys(sources.sources).length === 0) {
    errors.push("sources registry is empty")
  }

  console.log("Skill validation report")
  console.log(`- scanned skills: ${scans.length}`)
  console.log(`- configured sources: ${Object.keys(sources.sources || {}).length}`)
  console.log(`- errors: ${errors.length}`)
  console.log(`- warnings: ${warnings.length}`)

  if (warnings.length > 0) {
    console.log("\nWarnings:")
    for (const warning of warnings) console.log(`- ${warning}`)
  }

  if (errors.length > 0) {
    console.log("\nErrors:")
    for (const error of errors) console.log(`- ${error}`)
  }

  if (errors.length > 0 || (options.strict && warnings.length > 0)) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
