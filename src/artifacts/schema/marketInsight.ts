import type { Artifact } from "./base.js";

export type MarketFindingCategory =
  | "trend"
  | "competitor"
  | "user_need"
  | "risk"
  | "opportunity";

export type MarketFindingConfidence = "low" | "medium" | "high";

export interface MarketFinding {
  category: MarketFindingCategory;
  title: string;
  detail: string;
  confidence: MarketFindingConfidence;
}

export interface MarketInsightPayload {
  topic: string;
  targetMarket: string;
  period: string;
  findings: MarketFinding[];
  risks: string[];
  opportunities: string[];
  recommendedFocus: string[];
}

export type MarketInsightArtifact = Artifact<MarketInsightPayload>;
