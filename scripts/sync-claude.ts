import { file, write } from "bun";
import { join } from "path";
import {
  HOME,
  AI_DIR,
  SYSTEM_INSTRUCTIONS,
  MCP_SERVERS,
  ATHENA_PROMPT,
} from "./shared/config";
import { pathExists, ensureDirectory } from "./shared/utils";

const CLAUDE_DIR = join(HOME!, ".claude");
const CLAUDE_CONFIG_PATH = join(HOME!, ".claude.json");
const CLAUDE_INSTRUCTIONS_PATH = join(CLAUDE_DIR, "CLAUDE.md");

interface ClaudeConfig {
  projects?: Record<string, {
    mcpServers?: Record<string, {
      command: string;
      args: string[];
      env?: Record<string, string>;
    }>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

function buildMcpServers() {
  const servers: Record<string, { command: string; args: string[]; env?: Record<string, string> }> = {};
  
  for (const [name, config] of Object.entries(MCP_SERVERS)) {
    servers[name] = {
      command: config.command,
      args: config.args,
      ...(config.env && { env: config.env }),
    };
  }
  
  return servers;
}

async function loadConfig(): Promise<ClaudeConfig> {
  if (!(await pathExists(CLAUDE_CONFIG_PATH))) {
    return {};
  }

  try {
    return await file(CLAUDE_CONFIG_PATH).json();
  } catch {
    console.warn("Config file corrupted. Starting fresh.");
    return {};
  }
}

async function syncInstructions(): Promise<void> {
  const instructions = `${SYSTEM_INSTRUCTIONS}

## Default Agent: ATHENA

${ATHENA_PROMPT}
`;

  await ensureDirectory(CLAUDE_DIR);
  await write(CLAUDE_INSTRUCTIONS_PATH, instructions);
  console.log("  Instructions written to ~/.claude/CLAUDE.md");
}

async function syncMcpServers(): Promise<void> {
  const config = await loadConfig();
  const mcpServers = buildMcpServers();

  if (!config.projects) {
    config.projects = {};
  }

  const globalProject = config.projects[HOME!] || {};
  globalProject.mcpServers = mcpServers;
  config.projects[HOME!] = globalProject;

  await write(CLAUDE_CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log("  MCP servers configured in ~/.claude.json");
}

async function main() {
  console.log("Syncing AI configuration to Claude Code...\n");

  try {
    console.log("[1/2] Syncing instructions...");
    await syncInstructions();

    console.log("[2/2] Syncing MCP servers...");
    await syncMcpServers();

    console.log("\nSync complete!");
    console.log("\nNote: Claude Code reads CLAUDE.md from project root.");
    console.log("Run 'claude' in a project directory to use the agents.");
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
