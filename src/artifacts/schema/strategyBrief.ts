import type { Artifact } from "./base.js";

export interface StrategyKpi {
  name: string;
  target: string;
  reason: string;
}

export interface StrategyBriefPayload {
  targetUser: string;
  problem: string;
  valueProposition: string;
  differentiation: string;
  kpis: StrategyKpi[];
  strategicNotes: string[];
}

export type StrategyBriefArtifact = Artifact<StrategyBriefPayload>;
