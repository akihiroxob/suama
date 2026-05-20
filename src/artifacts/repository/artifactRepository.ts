import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Database } from "better-sqlite3";
import type { Artifact, ArtifactStatus, ArtifactType } from "../schema/base.js";
import { getDatabase } from "../storage/sqlite.js";

type ArtifactRow = {
  id: string;
  type: ArtifactType;
  version: number;
  title: string;
  created_at: string;
  created_by: string;
  status: ArtifactStatus;
  summary: string | null;
  payload_json: string;
};

type ArtifactInputRow = {
  input_artifact_id: string;
};

export class ArtifactRepository {
  private readonly db: Database;

  constructor(db: Database = getDatabase()) {
    this.db = db;
  }

  initialize(schemaPath = join(process.cwd(), "db", "schema.sql")): void {
    const schemaSql = readFileSync(schemaPath, "utf-8");
    this.db.exec(schemaSql);
  }

  createId(prefix: string): string {
    return `${prefix}-${randomUUID()}`;
  }

  save<TPayload>(artifact: Artifact<TPayload>): void {
    const insertArtifact = this.db.prepare(`
      INSERT INTO artifacts (
        id,
        type,
        version,
        title,
        created_at,
        created_by,
        status,
        summary,
        payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertInput = this.db.prepare(`
      INSERT INTO artifact_inputs (artifact_id, input_artifact_id)
      VALUES (?, ?)
    `);

    const transaction = this.db.transaction(() => {
      insertArtifact.run(
        artifact.id,
        artifact.type,
        artifact.version,
        artifact.title,
        artifact.createdAt,
        artifact.createdBy,
        artifact.status,
        artifact.summary ?? null,
        JSON.stringify(artifact.payload),
      );

      for (const inputArtifactId of artifact.inputArtifactIds) {
        insertInput.run(artifact.id, inputArtifactId);
      }
    });

    transaction();
  }

  getById<TPayload>(id: string): Artifact<TPayload> | null {
    const artifactRow = this.db
      .prepare("SELECT * FROM artifacts WHERE id = ?")
      .get(id) as ArtifactRow | undefined;

    if (!artifactRow) return null;

    const inputRows = this.db
      .prepare("SELECT input_artifact_id FROM artifact_inputs WHERE artifact_id = ?")
      .all(id) as ArtifactInputRow[];

    return {
      id: artifactRow.id,
      type: artifactRow.type,
      version: artifactRow.version,
      title: artifactRow.title,
      createdAt: artifactRow.created_at,
      createdBy: artifactRow.created_by,
      status: artifactRow.status,
      inputArtifactIds: inputRows.map((row) => row.input_artifact_id),
      summary: artifactRow.summary ?? undefined,
      payload: JSON.parse(artifactRow.payload_json) as TPayload,
    };
  }

  listByType<TPayload>(type: ArtifactType): Artifact<TPayload>[] {
    const rows = this.db
      .prepare("SELECT id FROM artifacts WHERE type = ? ORDER BY created_at DESC")
      .all(type) as { id: string }[];

    return rows
      .map((row) => this.getById<TPayload>(row.id))
      .filter((artifact): artifact is Artifact<TPayload> => artifact !== null);
  }
}
