import { file, write } from "bun";
import { join } from "path";
import {
  HOME,
  SYSTEM_INSTRUCTIONS,
  MCP_SERVERS,
  ATHENA_PROMPT,
} from "./shared/config";
import { pathExists, ensureDirectory } from "./shared/utils";

const GEMINI_DIR = join(HOME!, ".gemini");
const GEMINI_SETTINGS_PATH = join(GEMINI_DIR, "settings.json");
const GEMINI_INSTRUCTIONS_PATH = join(GEMINI_DIR, "GEMINI.md");

interface GeminiConfig {
  mcpServers?: Record<string, {
    command: string;
    args: string[];
    env?: Record<string, string>;
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

async function loadConfig(): Promise<GeminiConfig> {
  if (!(await pathExists(GEMINI_SETTINGS_PATH))) {
    return {};
  }

  try {
    return await file(GEMINI_SETTINGS_PATH).json();
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

  await ensureDirectory(GEMINI_DIR);
  await write(GEMINI_INSTRUCTIONS_PATH, instructions);
  console.log("  Instructions written to ~/.gemini/GEMINI.md");
}

async function syncMcpServers(): Promise<void> {
  const config = await loadConfig();
  config.mcpServers = buildMcpServers();

  await write(GEMINI_SETTINGS_PATH, JSON.stringify(config, null, 2));
  console.log("  MCP servers configured in ~/.gemini/settings.json");
}

async function main() {
  console.log("Syncing AI configuration to Gemini CLI...\n");

  try {
    await ensureDirectory(GEMINI_DIR);

    console.log("[1/2] Syncing instructions...");
    await syncInstructions();

    console.log("[2/2] Syncing MCP servers...");
    await syncMcpServers();

    console.log("\nSync complete!");
    console.log("\nNote: Gemini CLI reads GEMINI.md from ~/.gemini/");
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
