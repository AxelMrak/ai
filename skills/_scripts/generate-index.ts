import { readdir, stat } from "node:fs/promises"
import { join } from "path"

const SKILLS_ROOT = join(import.meta.dir, "..")
const INDEX_FILE = join(SKILLS_ROOT, "SKILL-INDEX.md")

interface SkillMeta {
  name: string
  description: string
  triggers: string[]
  category: string
  path: string
  source: "local" | "external" | "antigravity"
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
const EXTERNAL_SKILLS = ["frontend-design", "skill-creator", "webapp-testing", "react-best-practices", "web-design-guidelines"]

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

async function extractSkillMeta(skillPath: string, skillName: string): Promise<SkillMeta | null> {
  const possibleFiles = ["SKILL.md", "README.md", "index.md"]
  let description = ""

  for (const file of possibleFiles) {
    try {
      const content = await Bun.file(join(skillPath, file)).text()
      const descMatch =
        content.match(/description[:\s]*["']?([^"'\n]+)["']?/i) ||
        content.match(/^#[^#\n]+\n+([^\n#]+)/m) ||
        content.match(/^>?\s*([^\n]+)/m)

      if (descMatch) {
        description = descMatch[1].trim().slice(0, 200)
        break
      }
    } catch {
      continue
    }
  }

  if (!description) description = `${skillName} skill`

  let source: "local" | "external" | "antigravity" = "antigravity"
  if (LOCAL_SKILLS.includes(skillName)) source = "local"
  else if (EXTERNAL_SKILLS.includes(skillName)) source = "external"

  return {
    name: skillName,
    description: description.replace(/\|/g, "-").replace(/\n/g, " "),
    triggers: extractTriggers(description),
    category: detectCategory(skillName, description),
    path: `skills/${skillName}`,
    source,
  }
}

async function generateIndex(): Promise<void> {
  console.log("Generating skill index...\n")

  const entries = await readdir(SKILLS_ROOT)
  const skills: SkillMeta[] = []

  for (const entry of entries) {
    if (entry.startsWith("_") || entry.startsWith(".") || entry.endsWith(".md") || entry.endsWith(".json")) {
      continue
    }

    const entryPath = join(SKILLS_ROOT, entry)
    const entryStat = await stat(entryPath)

    if (entryStat.isDirectory()) {
      const meta = await extractSkillMeta(entryPath, entry)
      if (meta) {
        skills.push(meta)
        console.log(`  ${entry} -> ${meta.category}`)
      }
    }
  }

  skills.sort((a, b) => (a.category !== b.category ? a.category.localeCompare(b.category) : a.name.localeCompare(b.name)))

  const categories: Record<string, SkillMeta[]> = {}
  for (const skill of skills) {
    if (!categories[skill.category]) categories[skill.category] = []
    categories[skill.category].push(skill)
  }

  let output = `# SKILL INDEX

> Auto-generated. Run: \`bun run skills/_scripts/generate-index.ts\`
> Updated: ${new Date().toISOString().split("T")[0]} | Total: ${skills.length} skills

## Usage

1. Scan categories to find relevant skills
2. Match triggers to user intent
3. Load skill when needed
4. Don't reload same skill twice per session

## By Category

`

  for (const [category, categorySkills] of Object.entries(categories).sort()) {
    output += `### ${category} (${categorySkills.length})\n\n`
    output += `| Skill | Description | Triggers |\n`
    output += `|-------|-------------|----------|\n`

    for (const skill of categorySkills) {
      const shortDesc = skill.description.length > 80 ? skill.description.slice(0, 77) + "..." : skill.description
      const triggerStr = skill.triggers.length > 0 ? skill.triggers.slice(0, 3).join(", ") : "-"
      output += `| \`${skill.name}\` | ${shortDesc} | ${triggerStr} |\n`
    }

    output += `\n`
  }

  output += `## Full Registry

<details>
<summary>All ${skills.length} skills</summary>

| Skill | Category | Path | Source |
|-------|----------|------|--------|
`

  for (const skill of skills) {
    output += `| ${skill.name} | ${skill.category} | ${skill.path} | ${skill.source} |\n`
  }

  output += `
</details>

## Sources

- **local**: Custom rules for this project
- **external**: From anthropics/skills, vercel-labs
- **antigravity**: From antigravity-awesome-skills
`

  await Bun.write(INDEX_FILE, output)
  console.log(`\nCreated SKILL-INDEX.md (${skills.length} skills, ${Object.keys(categories).length} categories)`)
}

generateIndex().catch(console.error)
