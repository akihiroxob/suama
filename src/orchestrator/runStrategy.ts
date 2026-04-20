import type { ArtifactRepository } from "../artifacts/repository/artifactRepository.js";
import type { MarketInsightArtifact } from "../artifacts/schema/marketInsight.js";
import type { StrategyBriefArtifact, StrategyBriefPayload } from "../artifacts/schema/strategyBrief.js";
import { generateJson } from "../llm/generateJson.js";
import { createId } from "../utils/createId.js";
import { readAgentPromptAssets } from "../utils/readPromptAssets.js";

export async function runStrategy(
  repository: ArtifactRepository,
  marketInsight: MarketInsightArtifact,
): Promise<StrategyBriefArtifact> {
  const prompts = await readAgentPromptAssets("strategy", "insight_extraction.md");

  const instructions = `${prompts.role}\n\n${prompts.skill}`;
  const llmInput = JSON.stringify(marketInsight.payload, null, 2);

  const payload = await generateJson<StrategyBriefPayload>({
    instructions,
    input: `Create StrategyBriefPayload JSON using this MarketInsight payload:\n${llmInput}`,
  });

  const artifact: StrategyBriefArtifact = {
    id: createId("sb"),
    type: "StrategyBrief",
    version: 1,
    title: `Strategy Brief: ${marketInsight.payload.topic}`,
    createdAt: new Date().toISOString(),
    createdBy: "strategy-ai",
    status: "approved",
    inputArtifactIds: [marketInsight.id],
    summary: `Strategy for ${payload.targetUser} with ${payload.kpis.length} KPI candidates.`,
    payload,
  };

  return repository.save(artifact);
}
