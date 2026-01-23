import { mkdir, access, stat, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { join } from "path";
import { AI_SKILLS_DIR } from "./config";

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

export async function ensureDirectory(path: string): Promise<void> {
  if (!(await pathExists(path))) {
    await mkdir(path, { recursive: true });
  }
}

export async function getValidSkills(): Promise<{ skillName: string; srcPath: string }[]> {
  if (!(await pathExists(AI_SKILLS_DIR))) {
    return [];
  }

  const skillDirs = await readdir(AI_SKILLS_DIR);
  const validSkills = await Promise.all(
    skillDirs.map(async (skillName) => {
      if (skillName.startsWith("_") || skillName.startsWith(".")) {
        return null;
      }
      const srcPath = join(AI_SKILLS_DIR, skillName, "SKILL.md");
      const isDir = await isDirectory(join(AI_SKILLS_DIR, skillName));
      const hasSkillFile = await pathExists(srcPath);
      return isDir && hasSkillFile ? { skillName, srcPath } : null;
    })
  );

  return validSkills.filter((s): s is { skillName: string; srcPath: string } => s !== null);
}

export async function syncSkillsToDir(targetDir: string): Promise<void> {
  const skills = await getValidSkills();
  
  if (skills.length === 0) {
    console.log("No skills to sync");
    return;
  }

  await ensureDirectory(targetDir);

  await Promise.all(
    skills.map(async ({ skillName, srcPath }) => {
      const dstDir = join(targetDir, skillName);
      const dstPath = join(dstDir, "SKILL.md");

      await ensureDirectory(dstDir);
      await Bun.write(dstPath, await Bun.file(srcPath).text());
      console.log(`  Synced skill: ${skillName}`);
    })
  );
}
