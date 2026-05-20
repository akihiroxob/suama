import { ArtifactRepository } from "./artifacts/repository/artifactRepository.js";
import type { Artifact } from "./artifacts/schema/base.js";

type SamplePayload = {
  topic: string;
  findings: string[];
};

function main(): void {
  const repository = new ArtifactRepository();
  repository.initialize();

  const sampleArtifact: Artifact<SamplePayload> = {
    id: repository.createId("sample"),
    type: "MarketInsight",
    version: 1,
    title: "Sample market insight",
    createdAt: new Date().toISOString(),
    createdBy: "system",
    status: "draft",
    inputArtifactIds: [],
    summary: "SQLite artifact storage smoke test.",
    payload: {
      topic: "SUAMA",
      findings: [
        "Artifacts are stored as typed metadata plus JSON payload.",
        "Artifact dependencies are represented by artifact_inputs.",
      ],
    },
  };

  repository.save(sampleArtifact);

  const loadedArtifact = repository.getById<SamplePayload>(sampleArtifact.id);

  console.log("Saved artifact:");
  console.log(JSON.stringify(loadedArtifact, null, 2));
}

main();
