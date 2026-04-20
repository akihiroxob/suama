export type ArtifactStatus = "draft" | "reviewed" | "approved";

export interface Artifact<TPayload> {
  id: string;
  type: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
  status: ArtifactStatus;
  inputArtifactIds: string[];
  summary: string;
  payload: TPayload;
}
