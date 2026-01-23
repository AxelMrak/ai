import { $ } from "bun";
import { join } from "path";

const SCRIPTS_DIR = import.meta.dir;

async function runScript(name: string): Promise<boolean> {
  const scriptPath = join(SCRIPTS_DIR, `sync-${name}.ts`);
  
  try {
    await $`bun run ${scriptPath}`.quiet();
    return true;
  } catch (error) {
    console.error(`Failed to sync ${name}:`, error);
    return false;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║     AI Configuration Sync - All CLIs    ║");
  console.log("╚════════════════════════════════════════╝\n");

  const clis = ["opencode", "claude", "gemini", "codex"];
  const results: Record<string, boolean> = {};

  for (const cli of clis) {
    console.log(`\n${"─".repeat(40)}`);
    console.log(`Syncing ${cli.toUpperCase()}...`);
    console.log("─".repeat(40));
    
    const scriptPath = join(SCRIPTS_DIR, `sync-${cli}.ts`);
    
    try {
      const proc = Bun.spawn(["bun", "run", scriptPath], {
        stdout: "inherit",
        stderr: "inherit",
      });
      
      const exitCode = await proc.exited;
      results[cli] = exitCode === 0;
    } catch {
      results[cli] = false;
    }
  }

  console.log(`\n${"═".repeat(40)}`);
  console.log("SUMMARY");
  console.log("═".repeat(40));
  
  for (const [cli, success] of Object.entries(results)) {
    const status = success ? "✓" : "✗";
    console.log(`  ${status} ${cli}`);
  }

  const allSuccess = Object.values(results).every(Boolean);
  process.exit(allSuccess ? 0 : 1);
}

main();
