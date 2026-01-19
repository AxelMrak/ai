import { file, write } from "bun";
import { join } from "path";
import { existsSync, mkdirSync } from "node:fs";

const HOME = process.env.HOME!;
const AI_DIR = join(HOME, "Developer/ai");
const OPENCODE_DIR = join(HOME, ".config/opencode");
const OPENCODE_CONFIG_PATH = join(OPENCODE_DIR, "opencode.json");

const DEFAULT_CONFIG = {
  $schema: "https://opencode.ai/config.json",
  autoupdate: true,
  default_agent: "athena",
  watcher: {
    ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
  },
  mcp: {
    context7: {
      type: "remote",
      url: "https://mcp.context7.com/mcp",
      enabled: true,
    },
  },
  agent: {
    athena: {
      mode: "primary",
      description:
        "Daily Strategic Mentor. Strict Architect. Guide > Do. Blueprint-first.",
      prompt: "",
      tools: {
        write: true,
        edit: true,
      },
    },
    apollo: {
      mode: "primary",
      description:
        "Architectural Educator. Harmony & Logic. Explains trade-offs and patterns.",
      prompt: "",
      tools: {
        write: true,
        edit: true,
      },
    },
  },
};

async function main() {
  console.log("🔄 Syncing Axel Mrak DNA to OpenCode...");

  const manifestoPath = join(AI_DIR, "MANIFESTO.md");
  const agentsPath = join(AI_DIR, "AGENTS.md");
  const memoryPath = join(AI_DIR, "MEMORY.md");

  const requiredFiles = [manifestoPath, agentsPath, memoryPath];

  const missing = requiredFiles.filter((p) => !existsSync(p));
  if (missing.length > 0) {
    console.error("❌ CRITICAL: Missing context files in", AI_DIR);
    missing.forEach((p) => console.error(" -", p));
    process.exit(1);
  }

  const manifesto = await file(manifestoPath).text();
  const agents = await file(agentsPath).text();
  const memory = await file(memoryPath).text();

  if (!existsSync(OPENCODE_DIR)) {
    console.log(`📁 Creating directory: ${OPENCODE_DIR}`);
    mkdirSync(OPENCODE_DIR, { recursive: true });
  }

  let config: any;

  if (existsSync(OPENCODE_CONFIG_PATH)) {
    console.log(`📄 Reading existing config: ${OPENCODE_CONFIG_PATH}`);
    try {
      config = await file(OPENCODE_CONFIG_PATH).json();
    } catch {
      console.warn("⚠️ Config file corrupted. Resetting to default.");
      config = { ...DEFAULT_CONFIG };
    }
  } else {
    console.log("🆕 Creating new config from skeleton.");
    config = { ...DEFAULT_CONFIG };
  }

  config.$schema ??= DEFAULT_CONFIG.$schema;
  config.autoupdate ??= DEFAULT_CONFIG.autoupdate;
  config.default_agent ??= DEFAULT_CONFIG.default_agent;

  config.watcher = {
    ...DEFAULT_CONFIG.watcher,
    ...(config.watcher || {}),
  };

  config.mcp = {
    ...DEFAULT_CONFIG.mcp,
    ...(config.mcp || {}),
  };

  config.agent = {
    ...(DEFAULT_CONFIG.agent || {}),
    ...(config.agent || {}),
  };

  const manifestoHeader = manifesto.trim();
  const agentsHeader = agents.trim();
  const memoryHeader = memory.trim();

  const baseContext = `
${manifestoHeader}

${agentsHeader}

${memoryHeader}

---
The files above live in ~/Developer/ai and define the non-negotiable rules, agent personas, and current project memory.
You must treat them as the single source of truth.
`;

  if (config.agent.athena) {
    config.agent.athena.prompt = `${baseContext}

CURRENT AGENT: ATHENA
Act strictly as ATHENA defined in AGENTS.md.
Follow MANIFESTO.md and use MEMORY.md to avoid re-reading the full repo.
Always apply the Blueprint Protocol: justify → plan → ask for explicit approval → then propose code or edits.
`;
  }

  if (config.agent.apollo) {
    config.agent.apollo.prompt = `${baseContext}

CURRENT AGENT: APOLLO
Act strictly as APOLLO defined in AGENTS.md.
Follow MANIFESTO.md and use MEMORY.md to ground your analysis.
Always start with Observation and Diagnosis, then provide a Blueprint and ask for explicit approval before proposing code or edits.
`;
  }

  await write(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log("✅ Sync Complete. OpenCode is now powered by Axel Mrak.");
}

main();
