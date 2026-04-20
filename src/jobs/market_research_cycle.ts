import type { ArtifactRepository } from "../artifacts/repository/artifactRepository.js";
import { runIntel } from "../orchestrator/runIntel.js";
import { runStrategy } from "../orchestrator/runStrategy.js";

export interface MarketResearchCycleInput {
  topic: string;
  targetMarket: string;
  period: string;
}

export async function marketResearchCycle(
  repository: ArtifactRepository,
  input: MarketResearchCycleInput,
): Promise<void> {
  const marketInsight = await runIntel(repository, input);
  const strategyBrief = await runStrategy(repository, marketInsight);

  console.log("\n=== MarketInsight Artifact ===");
  console.log(JSON.stringify(marketInsight, null, 2));

  console.log("\n=== StrategyBrief Artifact ===");
  console.log(JSON.stringify(strategyBrief, null, 2));
}
