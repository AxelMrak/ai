import { file, write } from "bun";
import { join } from "path";
import {
  HOME,
  SYSTEM_INSTRUCTIONS,
  MCP_SERVERS,
  ATHENA_PROMPT,
} from "./shared/config";
import { pathExists, ensureDirectory } from "./shared/utils";

const CODEX_DIR = join(HOME!, ".codex");
const CODEX_CONFIG_PATH = join(CODEX_DIR, "config.toml");
const CODEX_INSTRUCTIONS_PATH = join(CODEX_DIR, "instructions.md");

function buildMcpToml(): string {
  const lines: string[] = [];
  
  for (const [name, config] of Object.entries(MCP_SERVERS)) {
    const safeName = name.replace(/-/g, "_");
    lines.push(`[mcp_servers.${safeName}]`);
    lines.push(`command = "${config.command}"`);
    lines.push(`args = [${config.args.map(a => `"${a}"`).join(", ")}]`);
    lines.push(`startup_timeout_sec = 60`);
    
    if (config.env) {
      const envPairs = Object.entries(config.env)
        .map(([k, v]) => `${k} = "${v}"`)
        .join(", ");
      lines.push(`env = { ${envPairs} }`);
    }
    
    lines.push("");
  }
  
  return lines.join("\n");
}

async function loadConfigToml(): Promise<string> {
  if (!(await pathExists(CODEX_CONFIG_PATH))) {
    return "";
  }

  try {
    return await file(CODEX_CONFIG_PATH).text();
  } catch {
    console.warn("Config file corrupted. Starting fresh.");
    return "";
  }
}

function removeMcpServersSection(toml: string): string {
  const lines = toml.split("\n");
  const result: string[] = [];
  let inMcpSection = false;
  
  for (const line of lines) {
    if (line.startsWith("[mcp_servers.")) {
      inMcpSection = true;
      continue;
    }
    
    if (inMcpSection && line.startsWith("[") && !line.startsWith("[mcp_servers.")) {
      inMcpSection = false;
    }
    
    if (!inMcpSection) {
      result.push(line);
    }
  }
  
  return result.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function syncInstructions(): Promise<void> {
  const instructions = `${SYSTEM_INSTRUCTIONS}

## Default Agent: ATHENA

${ATHENA_PROMPT}
`;

  await ensureDirectory(CODEX_DIR);
  await write(CODEX_INSTRUCTIONS_PATH, instructions);
  console.log("  Instructions written to ~/.codex/instructions.md");
}

async function syncMcpServers(): Promise<void> {
  let existingConfig = await loadConfigToml();
  
  existingConfig = removeMcpServersSection(existingConfig);
  
  const mcpSection = buildMcpToml();
  const newConfig = existingConfig 
    ? `${existingConfig}\n\n${mcpSection}`
    : mcpSection;

  await write(CODEX_CONFIG_PATH, newConfig);
  console.log("  MCP servers configured in ~/.codex/config.toml");
}

async function main() {
  console.log("Syncing AI configuration to Codex CLI...\n");

  try {
    await ensureDirectory(CODEX_DIR);

    console.log("[1/2] Syncing instructions...");
    await syncInstructions();

    console.log("[2/2] Syncing MCP servers...");
    await syncMcpServers();

    console.log("\nSync complete!");
    console.log("\nNote: Codex reads instructions.md from ~/.codex/");
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
