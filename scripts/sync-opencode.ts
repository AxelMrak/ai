import { file, write } from "bun";
import { join } from "path";
import {
  HOME,
  MCP_SERVERS,
  ATHENA_PROMPT,
  APOLLO_PROMPT,
} from "./shared/config";
import { pathExists, ensureDirectory, syncSkillsToDir } from "./shared/utils";

const OPENCODE_DIR = join(HOME!, ".config/opencode");
const OPENCODE_CONFIG_PATH = join(OPENCODE_DIR, "opencode.json");
const OPENCODE_SKILLS_DIR = join(OPENCODE_DIR, "skills");

interface AgentConfig {
  mode: string;
  description: string;
  prompt: string;
  tools: {
    write: boolean;
    edit: boolean;
    skill: boolean;
  };
}

interface OpenCodeConfig {
  $schema: string;
  autoupdate: boolean;
  default_agent: string;
  watcher: {
    ignore: string[];
  };
  mcp: Record<string, unknown>;
  agent: Record<string, AgentConfig>;
}

function buildMcpServers() {
  const servers: Record<string, {
    type: string;
    command: string[];
    environment?: Record<string, string>;
  }> = {};
  
  for (const [name, config] of Object.entries(MCP_SERVERS)) {
    servers[name] = {
      type: "local",
      command: [config.command, ...config.args],
      ...(config.env && { environment: config.env }),
    };
  }
  
  return servers;
}

const DEFAULT_CONFIG: OpenCodeConfig = {
  $schema: "https://opencode.ai/config.json",
  autoupdate: true,
  default_agent: "athena",
  watcher: {
    ignore: ["node_modules/**", "dist/**", "build/**", ".git/**"],
  },
  mcp: buildMcpServers(),
  agent: {
    athena: {
      mode: "primary",
      description: "Daily Strategic Mentor. Strict Architect. Guide > Do.",
      prompt: ATHENA_PROMPT,
      tools: {
        write: true,
        edit: true,
        skill: true,
      },
    },
    apollo: {
      mode: "primary",
      description: "Architectural Educator. Harmony & Logic.",
      prompt: APOLLO_PROMPT,
      tools: {
        write: true,
        edit: true,
        skill: true,
      },
    },
  },
};

async function loadConfig(): Promise<OpenCodeConfig> {
  if (!(await pathExists(OPENCODE_CONFIG_PATH))) {
    console.log("  Creating new config from defaults");
    return { ...DEFAULT_CONFIG };
  }

  console.log(`  Reading existing config: ${OPENCODE_CONFIG_PATH}`);
  try {
    const existingConfig = await file(OPENCODE_CONFIG_PATH).json();
    return {
      $schema: existingConfig.$schema ?? DEFAULT_CONFIG.$schema,
      autoupdate: existingConfig.autoupdate ?? DEFAULT_CONFIG.autoupdate,
      default_agent: existingConfig.default_agent ?? DEFAULT_CONFIG.default_agent,
      watcher: {
        ...DEFAULT_CONFIG.watcher,
        ...(existingConfig.watcher || {}),
      },
      mcp: buildMcpServers(),
      agent: {
        ...DEFAULT_CONFIG.agent,
        ...(existingConfig.agent || {}),
        athena: {
          ...DEFAULT_CONFIG.agent.athena,
          ...(existingConfig.agent?.athena || {}),
          prompt: ATHENA_PROMPT,
        },
        apollo: {
          ...DEFAULT_CONFIG.agent.apollo,
          ...(existingConfig.agent?.apollo || {}),
          prompt: APOLLO_PROMPT,
        },
      },
    };
  } catch {
    console.warn("  Config file corrupted. Resetting to defaults.");
    return { ...DEFAULT_CONFIG };
  }
}

async function main() {
  console.log("Syncing AI configuration to OpenCode...\n");

  try {
    await ensureDirectory(OPENCODE_DIR);
    await ensureDirectory(OPENCODE_SKILLS_DIR);

    console.log("[1/2] Syncing config and agents...");
    const config = await loadConfig();
    await write(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log("  Config written successfully");

    console.log("[2/2] Syncing skills...");
    await syncSkillsToDir(OPENCODE_SKILLS_DIR);

    console.log("\nSync complete!");
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
