import "dotenv/config";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { ArtifactRepository } from "./artifacts/repository/artifactRepository.js";
import { applySchema, createSqliteDatabase } from "./artifacts/storage/sqlite.js";
import { marketResearchCycle } from "./jobs/market_research_cycle.js";

async function main(): Promise<void> {
  const databasePath = process.env.DATABASE_PATH ?? "./db/suama.sqlite";
  mkdirSync(path.dirname(databasePath), { recursive: true });

  const db = createSqliteDatabase(databasePath);
  applySchema(db);

  const repository = new ArtifactRepository(db);

  await marketResearchCycle(repository, {
    topic: "AI-native customer support automation",
    targetMarket: "Japan SMB SaaS",
    period: "2026-Q2",
  });
}

main().catch((error) => {
  console.error("Failed to run SUAMA:", error);
  process.exitCode = 1;
});
