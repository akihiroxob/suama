import type { ArtifactRepository } from "../artifacts/repository/artifactRepository.js";
import type { MarketInsightArtifact, MarketInsightPayload } from "../artifacts/schema/marketInsight.js";
import { generateJson } from "../llm/generateJson.js";
import { createId } from "../utils/createId.js";
import { readAgentPromptAssets } from "../utils/readPromptAssets.js";

export interface RunIntelInput {
  topic: string;
  targetMarket: string;
  period: string;
}

export async function runIntel(
  repository: ArtifactRepository,
  input: RunIntelInput,
): Promise<MarketInsightArtifact> {
  const prompts = await readAgentPromptAssets("intel", "market_research.md");

  const instructions = `${prompts.role}\n\n${prompts.skill}`;
  const llmInput = JSON.stringify(input, null, 2);

  const payload = await generateJson<MarketInsightPayload>({
    instructions,
    input: `Create MarketInsightPayload JSON from this input:\n${llmInput}`,
  });

  const artifact: MarketInsightArtifact = {
    id: createId("mi"),
    type: "MarketInsight",
    version: 1,
    title: `Market Insight: ${payload.topic}`,
    createdAt: new Date().toISOString(),
    createdBy: "intel-ai",
    status: "reviewed",
    inputArtifactIds: [],
    summary: `Market insight for ${payload.targetMarket} (${payload.period}) with ${payload.findings.length} findings.`,
    payload,
  };

  return repository.save(artifact);
}
