import { file, write } from "bun";
import { join } from "path";
import { mkdir, readdir, access, stat } from "node:fs/promises";
import { constants } from "node:fs";

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

const HOME = process.env.HOME;
if (!HOME) {
  console.error("Error: HOME environment variable not set");
  process.exit(1);
}

const AI_DIR = join(HOME, "Developer/ai");
const OPENCODE_DIR = join(HOME, ".config/opencode");
const OPENCODE_CONFIG_PATH = join(OPENCODE_DIR, "opencode.json");
const OPENCODE_SKILLS_DIR = join(OPENCODE_DIR, "skills");
const AI_SKILLS_DIR = join(AI_DIR, "skills");

const ATHENA_PROMPT = `You are ATHENA (see AGENTS.md in ~/Developer/ai).

Follow MANIFESTO.md and use MEMORY.md from ~/Developer/ai.

Available skills in ~/.config/opencode/skills/:
- Use skill() to load MANIFESTO.md, AGENTS.md, MEMORY.md or project skills (python, react, rules)

Always apply Blueprint Protocol and ask "¿Le mando mecha?" before edits.`;

const APOLLO_PROMPT = `You are APOLLO (see AGENTS.md in ~/Developer/ai).

Follow MANIFESTO.md and use MEMORY.md from ~/Developer/ai.

Available skills in ~/.config/opencode/skills/:
- Use skill() to load MANIFESTO.md, AGENTS.md, MEMORY.md or project skills (python, react, rules)

Always start with Observation + Diagnosis, then Blueprint, then ask for approval.`;

const DEFAULT_CONFIG: OpenCodeConfig = {
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

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function ensureDirectory(path: string): Promise<void> {
  if (!(await pathExists(path))) {
    await mkdir(path, { recursive: true });
  }
}

async function loadConfig(): Promise<OpenCodeConfig> {
  if (!(await pathExists(OPENCODE_CONFIG_PATH))) {
    console.log("Creating new config from defaults");
    return { ...DEFAULT_CONFIG };
  }

  console.log(`Reading existing config: ${OPENCODE_CONFIG_PATH}`);
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
      mcp: {
        ...DEFAULT_CONFIG.mcp,
        ...(existingConfig.mcp || {}),
      },
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
  } catch (error) {
    console.warn("Config file corrupted. Resetting to defaults.");
    return { ...DEFAULT_CONFIG };
  }
}

async function syncSkills(): Promise<void> {
  if (!(await pathExists(AI_SKILLS_DIR))) {
    console.log("No skills directory found. Skipping skill sync.");
    return;
  }

  const skillDirs = await readdir(AI_SKILLS_DIR);
  const validSkills = await Promise.all(
    skillDirs.map(async (skillName) => {
      const srcPath = join(AI_SKILLS_DIR, skillName, "SKILL.md");
      const isDir = await isDirectory(join(AI_SKILLS_DIR, skillName));
      const hasSkillFile = await pathExists(srcPath);
      return isDir && hasSkillFile ? { skillName, srcPath } : null;
    })
  );

  const skillsToSync = validSkills.filter((s): s is { skillName: string; srcPath: string } => s !== null);

  await Promise.all(
    skillsToSync.map(async ({ skillName, srcPath }) => {
      const dstDir = join(OPENCODE_SKILLS_DIR, skillName);
      const dstPath = join(dstDir, "SKILL.md");

      await ensureDirectory(dstDir);
      await Bun.write(dstPath, await Bun.file(srcPath).text());
      console.log(`Synced skill: ${skillName}`);
    })
  );
}

async function main() {
  try {
    console.log("Syncing AI configuration to OpenCode");

    await ensureDirectory(OPENCODE_DIR);
    await ensureDirectory(OPENCODE_SKILLS_DIR);

    const config = await loadConfig();
    await write(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log("Config written successfully");

    await syncSkills();

    console.log("Sync complete");
  } catch (error) {
    console.error("Sync failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
