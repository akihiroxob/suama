import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveSchemaPath(): string {
  return path.resolve(__dirname, "../../../db/schema.sql");
}

export function createSqliteDatabase(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function applySchema(db: Database.Database): void {
  const schemaSql = readFileSync(resolveSchemaPath(), "utf-8");
  db.exec(schemaSql);
}
