import { readdir, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")

interface CliOptions {
  overwriteSkillMd: boolean
  only: string | null
}

function parseArgs(argv: string[]): CliOptions {
  let overwriteSkillMd = false
  let only: string | null = null

  for (const arg of argv) {
    if (arg === "--overwrite-skill-md") overwriteSkillMd = true
    if (arg.startsWith("--only=")) only = arg.slice("--only=".length)
  }

  return { overwriteSkillMd, only }
}

function formatRule(content: string, filename: string): string {
  const titleMatch = content.match(/title:\s*(.*)/)
  const title = titleMatch ? titleMatch[1].trim() : filename.replace(".md", "")
  const body = content.replace(/---[\s\S]*?---/, "").trim()
  return `\n### RULE: ${title}\n(File: ${filename})\n\n${body}\n`
}

async function shouldWriteSkillMd(skillDir: string, overwriteSkillMd: boolean): Promise<boolean> {
  const skillMdPath = join(skillDir, "SKILL.md")
  try {
    await stat(skillMdPath)
    return overwriteSkillMd
  } catch {
    return true
  }
}

async function buildSkillSet(skillName: string, options: CliOptions) {
  const skillDir = join(SKILLS_ROOT, skillName)
  const rulesDir = join(skillDir, "rules")

  try {
    const stats = await stat(rulesDir)
    if (!stats.isDirectory()) return
  } catch {
    return
  }

  console.log(`Building ${skillName}...`)

  const files = await readdir(rulesDir)
  const mdFiles = files.filter((f) => f.endsWith(".md")).sort()

  if (mdFiles.length === 0) {
    console.log("  No rules found")
    return
  }

  const groups: Record<string, string[]> = {}
  for (const filename of mdFiles) {
    const prefix = filename.split("-")[0]
    if (!groups[prefix]) groups[prefix] = []
    groups[prefix].push(filename)
  }

  for (const [prefix, groupFiles] of Object.entries(groups)) {
    if (prefix.startsWith("_") && prefix !== "_custom") continue

    let output = `# ${skillName.toUpperCase()} - ${prefix.toUpperCase()}\n`
    output += `> Generated: ${new Date().toISOString().split("T")[0]}\n`
    output += `> Rules: ${groupFiles.length}\n\n`

    for (const filename of groupFiles) {
      const content = await Bun.file(join(rulesDir, filename)).text()
      output += formatRule(content, filename)
    }

    const outputFile = join(skillDir, `${prefix}-rules.md`)
    await Bun.write(outputFile, output)
    console.log(`  Created ${prefix}-rules.md`)
  }

  const canWriteSkillMd = await shouldWriteSkillMd(skillDir, options.overwriteSkillMd)
  if (!canWriteSkillMd) {
    console.log("  Preserved existing SKILL.md (use --overwrite-skill-md to replace)")
    return
  }

  const validGroups = Object.keys(groups).filter((g) => !g.startsWith("_") || g === "_custom")
  let mainOutput = `# ${skillName.toUpperCase()}\n`
  mainOutput += `> Generated: ${new Date().toISOString().split("T")[0]}\n`
  mainOutput += `> Rules: ${mdFiles.length} across ${validGroups.length} modules\n\n`
  mainOutput += "## Modules\n\n"

  for (const [prefix, groupFiles] of Object.entries(groups)) {
    if (prefix.startsWith("_") && prefix !== "_custom") continue
    const displayName = prefix === "_custom" ? "custom (user-taught)" : `${prefix}-rules.md`
    mainOutput += `- **${displayName}**: ${groupFiles.length} rules\n`
  }

  await Bun.write(join(skillDir, "SKILL.md"), mainOutput)
  console.log("  Created SKILL.md")
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  console.log("Building skills...\n")
  if (!options.overwriteSkillMd) {
    console.log("Safe mode: existing SKILL.md files are preserved.\n")
  }

  const folders = await readdir(SKILLS_ROOT)
  for (const folder of folders) {
    if (folder.startsWith("_") || folder.startsWith(".")) continue
    if (options.only && folder !== options.only) continue

    const folderPath = join(SKILLS_ROOT, folder)
    try {
      const stats = await stat(folderPath)
      if (stats.isDirectory()) await buildSkillSet(folder, options)
    } catch {
      continue
    }
  }

  console.log("\nDone.")
}

main().catch(console.error)
