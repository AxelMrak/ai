import { readdir, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")
const INDEX_FILE = join(SKILLS_ROOT, "SKILL-INDEX.md")
const SOURCES_FILE = join(SKILLS_ROOT, "_sources.json")
const CANONICAL_FILE = join(SKILLS_ROOT, "_canonical.json")

interface SkillMeta {
  id: string
  name: string
  canonical: string
  description: string
  triggers: string[]
  category: string
  path: string
  source: "local" | "external" | "antigravity"
}

interface SourcesConfig {
  sources: Record<string, unknown>
}

interface CanonicalRule {
  preferred: string
  aliases?: string[]
}

interface CanonicalConfig {
  by_name?: Record<string, CanonicalRule>
}

interface FrontmatterData {
  name?: string
  description?: string
}

interface CliOptions {
  strict: boolean
}

const CATEGORY_MAP: Record<string, string> = {
  agent: "AI Agents & LLM",
  ai: "AI Agents & LLM",
  llm: "AI Agents & LLM",
  rag: "AI Agents & LLM",
  prompt: "AI Agents & LLM",
  langchain: "AI Agents & LLM",
  langgraph: "AI Agents & LLM",
  crewai: "AI Agents & LLM",
  voice: "AI Agents & LLM",

  react: "Development",
  next: "Development",
  node: "Development",
  typescript: "Development",
  javascript: "Development",
  python: "Development",
  bun: "Development",
  frontend: "Development",
  backend: "Development",
  fullstack: "Development",
  api: "Development",
  database: "Development",
  prisma: "Development",
  nest: "Development",
  express: "Development",

  test: "Testing & QA",
  playwright: "Testing & QA",
  tdd: "Testing & QA",
  debug: "Testing & QA",
  verification: "Testing & QA",

  security: "Cybersecurity",
  pentest: "Cybersecurity",
  hack: "Cybersecurity",
  xss: "Cybersecurity",
  sql: "Cybersecurity",
  injection: "Cybersecurity",
  privilege: "Cybersecurity",
  burp: "Cybersecurity",
  metasploit: "Cybersecurity",
  owasp: "Cybersecurity",
  vulnerability: "Cybersecurity",
  exploit: "Cybersecurity",

  git: "Infrastructure & Git",
  docker: "Infrastructure & Git",
  linux: "Infrastructure & Git",
  bash: "Infrastructure & Git",
  shell: "Infrastructure & Git",
  deploy: "Infrastructure & Git",
  aws: "Infrastructure & Git",
  gcp: "Infrastructure & Git",
  azure: "Infrastructure & Git",
  serverless: "Infrastructure & Git",

  stripe: "Integrations & APIs",
  mercadopago: "Integrations & APIs",
  payment: "Integrations & APIs",
  firebase: "Integrations & APIs",
  supabase: "Integrations & APIs",
  clerk: "Integrations & APIs",
  twilio: "Integrations & APIs",
  discord: "Integrations & APIs",
  slack: "Integrations & APIs",
  telegram: "Integrations & APIs",
  graphql: "Integrations & APIs",
  shopify: "Integrations & APIs",
  hubspot: "Integrations & APIs",
  plaid: "Integrations & APIs",
  segment: "Integrations & APIs",
  algolia: "Integrations & APIs",

  design: "Creative & Design",
  ui: "Creative & Design",
  ux: "Creative & Design",
  css: "Creative & Design",
  tailwind: "Creative & Design",
  canvas: "Creative & Design",
  art: "Creative & Design",
  d3: "Creative & Design",
  theme: "Creative & Design",
  "3d": "Creative & Design",

  seo: "Marketing & Growth",
  cro: "Marketing & Growth",
  copy: "Marketing & Growth",
  email: "Marketing & Growth",
  marketing: "Marketing & Growth",
  ads: "Marketing & Growth",
  content: "Marketing & Growth",
  social: "Marketing & Growth",
  launch: "Marketing & Growth",
  referral: "Marketing & Growth",
  pricing: "Marketing & Growth",

  plan: "Workflow & Planning",
  writing: "Workflow & Planning",
  review: "Workflow & Planning",
  concise: "Workflow & Planning",
  executing: "Workflow & Planning",

  saas: "Maker Tools",
  micro: "Maker Tools",
  extension: "Maker Tools",
  bot: "Maker Tools",
  wrapper: "Maker Tools",
  viral: "Maker Tools",
  portfolio: "Maker Tools",
  tool: "Maker Tools",

  docx: "Document Processing",
  pdf: "Document Processing",
  pptx: "Document Processing",
  xlsx: "Document Processing",

  game: "Game Development",
  "2d": "Game Development",
  multiplayer: "Game Development",
  vr: "Game Development",
  ar: "Game Development",

  product: "Product & Strategy",
  brainstorm: "Product & Strategy",
  doc: "Product & Strategy",
  internal: "Product & Strategy",

  loki: "Autonomous & Agentic",
  subagent: "Autonomous & Agentic",
  parallel: "Autonomous & Agentic",
  dispatch: "Autonomous & Agentic",
  skill: "Autonomous & Agentic",
  autonomous: "Autonomous & Agentic",
}

const LOCAL_SKILLS = ["general", "python", "react"]

function parseArgs(argv: string[]): CliOptions {
  return { strict: argv.includes("--strict") }
}

function parseFrontmatter(content: string): FrontmatterData {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return {}

  const lines = frontmatterMatch[1].split("\n")
  const data: FrontmatterData = {}

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue

    const key = match[1]
    const rawValue = match[2].trim()

    if (rawValue === ">" || rawValue === "|") {
      const chunks: string[] = []
      i++
      while (i < lines.length && /^\s+/.test(lines[i])) {
        chunks.push(lines[i].trim())
        i++
      }
      i--
      const blockValue = chunks.join(" ").trim()
      if (key === "description" && blockValue) data.description = blockValue
      if (key === "name" && blockValue) data.name = blockValue
      continue
    }

    const value = rawValue.replace(/^['"]|['"]$/g, "").trim()
    if (!value) continue
    if (key === "description") data.description = value
    if (key === "name") data.name = value
  }

  return data
}

async function loadExternalSkills(): Promise<Set<string>> {
  try {
    const config = (await Bun.file(SOURCES_FILE).json()) as SourcesConfig
    return new Set(Object.keys(config.sources || {}))
  } catch {
    return new Set()
  }
}

async function loadCanonical(): Promise<CanonicalConfig> {
  try {
    return (await Bun.file(CANONICAL_FILE).json()) as CanonicalConfig
  } catch {
    return {}
  }
}

function detectCategory(name: string, description: string): string {
  const combined = `${name} ${description}`.toLowerCase()
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (combined.includes(keyword)) return category
  }
  return "General"
}

function extractTriggers(description: string): string[] {
  const triggers: string[] = []

  const useWhenMatch = description.match(/Use when[:\s]+(.*?)(?:\.|$)/i)
  if (useWhenMatch) {
    triggers.push(
      ...useWhenMatch[1]
        .split(/[,;]/)
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 2 && k.length < 30)
    )
  }

  const keywordMatch = description.match(/keywords?[:\s]+(.*?)(?:\.|$)/i)
  if (keywordMatch) {
    triggers.push(
      ...keywordMatch[1]
        .split(/[,;]/)
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 2 && k.length < 30)
    )
  }

  return [...new Set(triggers)].slice(0, 5)
}

async function extractSkillMeta(skillPath: string, skillId: string, externalSkills: Set<string>, canonicalConfig: CanonicalConfig): Promise<SkillMeta | null> {
  const possibleFiles = ["SKILL.md", "README.md", "index.md"]
  let description = ""
  let frontmatterName = ""

  for (const file of possibleFiles) {
    try {
      const content = await Bun.file(join(skillPath, file)).text()
      const frontmatter = parseFrontmatter(content)

      if (frontmatter.name && !frontmatterName) frontmatterName = frontmatter.name
      if (frontmatter.description && !description) description = frontmatter.description

      if (!description) {
        const fallback =
          content.match(/^#[^#\n]+\n+([^\n#]+)/m) ||
          content.match(/^>\s*([^\n]+)/m)
        if (fallback) description = fallback[1].trim().slice(0, 200)
      }

      if (description) break
    } catch {
      continue
    }
  }

  if (!description) description = `${skillId} skill`

  let source: "local" | "external" | "antigravity" = "antigravity"
  if (LOCAL_SKILLS.includes(skillId)) source = "local"
  else if (externalSkills.has(skillId)) source = "external"

  const name = frontmatterName || skillId
  const canonicalRule = canonicalConfig.by_name?.[name]
  const canonical = canonicalRule?.preferred || skillId

  return {
    id: skillId,
    name,
    canonical,
    description: description.replace(/\|/g, "-").replace(/\n/g, " "),
    triggers: extractTriggers(description),
    category: detectCategory(skillId, description),
    path: `skills/${skillId}`,
    source,
  }
}

function collectQualityWarnings(skills: SkillMeta[]): string[] {
  const warnings: string[] = []
  const nameToIds = new Map<string, string[]>()

  for (const skill of skills) {
    if (!nameToIds.has(skill.name)) nameToIds.set(skill.name, [])
    nameToIds.get(skill.name)?.push(skill.id)

    if (skill.description === ">" || skill.description.length < 8) {
      warnings.push(`Weak description for ${skill.id}: "${skill.description}"`)
    }
  }

  for (const [name, ids] of nameToIds.entries()) {
    if (ids.length > 1) {
      warnings.push(`Duplicate frontmatter name \`${name}\` in: ${ids.join(", ")}`)
    }
  }

  return warnings
}

async function generateIndex(): Promise<void> {
  const options = parseArgs(process.argv.slice(2))
  console.log("Generating skill index...\n")

  const entries = await readdir(SKILLS_ROOT)
  const skills: SkillMeta[] = []
  const externalSkills = await loadExternalSkills()
  const canonicalConfig = await loadCanonical()

  for (const entry of entries) {
    if (entry.startsWith("_") || entry.startsWith(".") || entry.endsWith(".md") || entry.endsWith(".json")) continue

    const entryPath = join(SKILLS_ROOT, entry)
    const entryStat = await stat(entryPath)

    if (entryStat.isDirectory()) {
      const meta = await extractSkillMeta(entryPath, entry, externalSkills, canonicalConfig)
      if (meta) {
        skills.push(meta)
        console.log(`  ${entry} -> ${meta.category}`)
      }
    }
  }

  skills.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category)
    return a.id.localeCompare(b.id)
  })

  const categories: Record<string, SkillMeta[]> = {}
  for (const skill of skills) {
    if (!categories[skill.category]) categories[skill.category] = []
    categories[skill.category].push(skill)
  }

  const warnings = collectQualityWarnings(skills)

  let output = `# SKILL INDEX\n\n`
  output += `> Auto-generated. Run: \`bun run skills/_scripts/generate-index.ts\`\n`
  output += `> Updated: ${new Date().toISOString().split("T")[0]} | Total: ${skills.length} skills\n\n`
  output += `## Source of Truth\n\n`
  output += `- Canonical index path: \`skills/SKILL-INDEX.md\`\n`
  output += `- Registry: \`skills/_sources.json\`\n`
  output += `- Canonical aliases: \`skills/_canonical.json\`\n\n`
  output += `## Usage\n\n`
  output += `1. Scan categories to find relevant skills\n`
  output += `2. Match triggers to user intent\n`
  output += `3. Load skill by directory id (first column)\n`
  output += `4. Use canonical alias column if name collisions exist\n\n`
  output += `## By Category\n\n`

  for (const [category, categorySkills] of Object.entries(categories).sort()) {
    output += `### ${category} (${categorySkills.length})\n\n`
    output += `| Skill ID | Canonical Alias | Description | Triggers |\n`
    output += `|----------|------------------|-------------|----------|\n`

    for (const skill of categorySkills) {
      const shortDesc = skill.description.length > 80 ? `${skill.description.slice(0, 77)}...` : skill.description
      const triggerStr = skill.triggers.length > 0 ? skill.triggers.slice(0, 3).join(", ") : "-"
      const alias = skill.canonical !== skill.id ? skill.canonical : "-"
      output += `| \`${skill.id}\` | ${alias} | ${shortDesc} | ${triggerStr} |\n`
    }

    output += "\n"
  }

  output += `## Full Registry\n\n`
  output += `<details>\n<summary>All ${skills.length} skills</summary>\n\n`
  output += `| Skill ID | Frontmatter Name | Canonical Alias | Category | Path | Source |\n`
  output += `|----------|------------------|------------------|----------|------|--------|\n`

  for (const skill of skills) {
    output += `| ${skill.id} | ${skill.name} | ${skill.canonical} | ${skill.category} | ${skill.path} | ${skill.source} |\n`
  }

  output += `\n</details>\n\n`

  if (warnings.length > 0) {
    output += `## Quality Notes\n\n`
    for (const warning of warnings) output += `- ${warning}\n`
    output += "\n"
  }

  output += `## Sources\n\n`
  output += `- **local**: Custom rules for this project\n`
  output += `- **external**: Registered in \`skills/_sources.json\`\n`
  output += `- **antigravity**: Imported from antigravity-awesome-skills\n`

  await Bun.write(INDEX_FILE, output)
  console.log(`\nCreated SKILL-INDEX.md (${skills.length} skills, ${Object.keys(categories).length} categories)`)

  if (warnings.length > 0) {
    console.log(`\nQuality warnings: ${warnings.length}`)
    for (const warning of warnings) console.log(`  - ${warning}`)
  }

  if (options.strict && warnings.length > 0) {
    process.exitCode = 1
  }
}

generateIndex().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
