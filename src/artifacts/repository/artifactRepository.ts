import type Database from "better-sqlite3";
import type { Artifact } from "../schema/base.js";

interface ArtifactRow {
  id: string;
  type: string;
  version: number;
  title: string;
  created_at: string;
  created_by: string;
  status: "draft" | "reviewed" | "approved";
  summary: string;
  payload_json: string;
}

export class ArtifactRepository {
  constructor(private readonly db: Database.Database) {}

  save<TPayload>(artifact: Artifact<TPayload>): Artifact<TPayload> {
    const insertArtifact = this.db.prepare(`
      INSERT INTO artifacts (id, type, version, title, created_at, created_by, status, summary, payload_json)
      VALUES (@id, @type, @version, @title, @created_at, @created_by, @status, @summary, @payload_json)
    `);

    const insertInput = this.db.prepare(`
      INSERT INTO artifact_inputs (artifact_id, input_artifact_id)
      VALUES (?, ?)
    `);

    const tx = this.db.transaction(() => {
      insertArtifact.run({
        id: artifact.id,
        type: artifact.type,
        version: artifact.version,
        title: artifact.title,
        created_at: artifact.createdAt,
        created_by: artifact.createdBy,
        status: artifact.status,
        summary: artifact.summary,
        payload_json: JSON.stringify(artifact.payload),
      });

      for (const inputId of artifact.inputArtifactIds) {
        insertInput.run(artifact.id, inputId);
      }
    });

    tx();
    return artifact;
  }

  getById<TPayload>(id: string): Artifact<TPayload> | null {
    const artifactRow = this.db
      .prepare("SELECT * FROM artifacts WHERE id = ?")
      .get(id) as ArtifactRow | undefined;

    if (!artifactRow) {
      return null;
    }

    const inputRows = this.db
      .prepare("SELECT input_artifact_id FROM artifact_inputs WHERE artifact_id = ?")
      .all(id) as Array<{ input_artifact_id: string }>;

    return {
      id: artifactRow.id,
      type: artifactRow.type,
      version: artifactRow.version,
      title: artifactRow.title,
      createdAt: artifactRow.created_at,
      createdBy: artifactRow.created_by,
      status: artifactRow.status,
      summary: artifactRow.summary,
      inputArtifactIds: inputRows.map((r) => r.input_artifact_id),
      payload: JSON.parse(artifactRow.payload_json) as TPayload,
    };
  }
}
