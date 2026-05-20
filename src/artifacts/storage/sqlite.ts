import Database from "better-sqlite3";

let database: Database.Database | null = null;

export function getDatabase(dbPath = "suama.db"): Database.Database {
  if (!database) {
    database = new Database(dbPath);
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = ON");
  }

  return database;
}

export function closeDatabase(): void {
  if (!database) return;
  database.close();
  database = null;
}
