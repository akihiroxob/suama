import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function srcRoot(): string {
  return path.resolve(__dirname, "..");
}

export async function readPromptAsset(relativePathFromSrc: string): Promise<string> {
  const fullPath = path.resolve(srcRoot(), relativePathFromSrc);
  return readFile(fullPath, "utf-8");
}

export interface AgentPromptAssets {
  role: string;
  skill: string;
}

export async function readAgentPromptAssets(
  agentName: "intel" | "strategy",
  skillFileName: string,
): Promise<AgentPromptAssets> {
  const base = `agents/${agentName}`;
  const role = await readPromptAsset(`${base}/role.md`);
  const skill = await readPromptAsset(`${base}/skills/${skillFileName}`);
  return { role, skill };
}
