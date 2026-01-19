import { file, write } from "bun";
import { join } from "path";
import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";

const HOME = process.env.HOME!;
const AI_DIR = join(HOME, "Developer/ai");
const OPENCODE_DIR = join(HOME, ".config/opencode");
const OPENCODE_CONFIG_PATH = join(OPENCODE_DIR, "opencode.json");
const OPENCODE_SKILLS_DIR = join(OPENCODE_DIR, "skills");
const AI_SKILLS_DIR = join(AI_DIR, "skills");

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
      description: "Daily Strategic Mentor. Strict Architect. Guide > Do.",
      prompt: "",
      tools: {
        write: true,
        edit: true,
        skill: true,
      },
    },
    apollo: {
      mode: "primary",
      description: "Architectural Educator. Harmony & Logic.",
      prompt: "",
      tools: {
        write: true,
        edit: true,
        skill: true,
      },
    },
  },
};

async function main() {
  console.log("🔄 Syncing Axel Mrak DNA to OpenCode (Skills Mode)...");

  if (!existsSync(OPENCODE_DIR)) {
    await mkdir(OPENCODE_DIR, { recursive: true });
  }

  if (!existsSync(OPENCODE_SKILLS_DIR)) {
    await mkdir(OPENCODE_SKILLS_DIR, { recursive: true });
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

  config.agent.athena.prompt = `
You are ATHENA (see AGENTS.md in ~/Developer/ai).

Follow MANIFESTO.md and use MEMORY.md from ~/Developer/ai.

Available skills in ~/.config/opencode/skills/:
- Use skill() to load MANIFESTO.md, AGENTS.md, MEMORY.md or project skills (python, react, rules)

Always apply Blueprint Protocol and ask "¿Le mando mecha?" before edits.
`;

  config.agent.apollo.prompt = `
You are APOLLO (see AGENTS.md in ~/Developer/ai).

Follow MANIFESTO.md and use MEMORY.md from ~/Developer/ai.

Available skills in ~/.config/opencode/skills/:
- Use skill() to load MANIFESTO.md, AGENTS.md, MEMORY.md or project skills (python, react, rules)

Always start with Observation + Diagnosis, then Blueprint, then ask for approval.
`;

  await write(OPENCODE_CONFIG_PATH, JSON.stringify(config, null, 2));

  if (existsSync(AI_SKILLS_DIR)) {
    const skillDirs = await readdir(AI_SKILLS_DIR);
    for (const skillName of skillDirs) {
      const srcPath = join(AI_SKILLS_DIR, skillName, "SKILL.md");
      const dstDir = join(OPENCODE_SKILLS_DIR, skillName);
      const dstPath = join(dstDir, "SKILL.md");

      if (existsSync(srcPath)) {
        await mkdir(dstDir, { recursive: true });
        await Bun.write(dstPath, await Bun.file(srcPath).text());
        console.log(`📋 Synced skill: ${skillName}`);
      }
    }
  }

  console.log("✅ Sync Complete. Skills mode enabled.");
}

main();
