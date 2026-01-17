import { file, write } from "bun";
import { join } from "path";
import { existsSync, mkdirSync } from "node:fs";
const AI_DIR = join(process.env.HOME!, "Developer/ai");
const OPENCODE_DIR = join(process.env.HOME!, ".config/opencode");
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
      description: "Daily Strategic Mentor. Strict Architect.",
      prompt: "Specific Role: Athena (Principal SE).",
      tools: { write: true, edit: true },
    },
    apollo: {
      mode: "primary",
      description: "Architectural Educator. Harmony & Logic.",
      prompt: "Specific Role: Apollo (Senior Architect).",
      tools: { write: true, edit: true },
    },
  },
};

async function main() {
  console.log("🔄 Syncing Axel Mrak DNA to OpenCode...");

  const manifestoPath = join(AI_DIR, "MANIFESTO.md");
  const agentsPath = join(AI_DIR, "AGENTS.md");

  if (!existsSync(manifestoPath) || !existsSync(agentsPath)) {
    console.error(`❌ CRITICAL: Context files not found in ${AI_DIR}`);
    console.error("Please run the setup logic first.");
    process.exit(1);
  }

  const manifesto = await file(manifestoPath).text();
  const agents = await file(agentsPath).text();

  const systemContext = `
${manifesto}

${agents}

---
### ⚠️ INJECTION OVERRIDE
The above rules are absolute. Adopt the persona defined above.
`;

  let config;

  if (!existsSync(OPENCODE_DIR)) {
    console.log(` Creating directory: ${OPENCODE_DIR}`);
    mkdirSync(OPENCODE_DIR, { recursive: true });
  }

  if (existsSync(OPENCODE_CONFIG_PATH)) {
    console.log(`📄 Reading existing config: ${OPENCODE_CONFIG_PATH}`);
    try {
      config = await file(OPENCODE_CONFIG_PATH).json();
      config.mcp = { ...DEFAULT_CONFIG.mcp, ...config.mcp };
      config.agent = { ...DEFAULT_CONFIG.agent, ...config.agent };
    } catch (e) {
      console.warn("⚠️ Config file corrupted. Resetting to default.");
      config = DEFAULT_CONFIG;
    }
  } else {
    console.log(" Creating new config from skeleton.");
    config = DEFAULT_CONFIG;
  }

  if (config.agent?.athena) {
    config.agent.athena.prompt =
      systemContext + "\n\nCURRENT AGENT: ATHENA (Act as defined in AGENTS.md)";
  }

  if (config.agent?.apollo) {
    config.agent.apollo.prompt =
      systemContext + "\n\nCURRENT AGENT: APOLLO (Act as defined in AGENTS.md)";
  }

  await write(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log("✅ Sync Complete. OpenCode is now powered by Axel Mrak.");
}

main();
