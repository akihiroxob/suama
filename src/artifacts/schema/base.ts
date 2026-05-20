export type ArtifactStatus = "draft" | "reviewed" | "approved";

export type ArtifactType =
  | "MarketInsight"
  | "StrategyBrief"
  | "ProductSpec"
  | "StoryArtifact"
  | "OpsReport"
  | "LegalConstraints"
  | string;

export type Artifact<TPayload> = {
  id: string;
  type: ArtifactType;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
  status: ArtifactStatus;
  inputArtifactIds: string[];
  summary?: string;
  payload: TPayload;
};

export type ArtifactRecord = {
  id: string;
  type: ArtifactType;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
  status: ArtifactStatus;
  inputArtifactIds: string[];
  summary?: string;
  payloadJson: string;
};
