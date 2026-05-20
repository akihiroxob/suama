# suama

SUAMA stands for **System for Unified Artifact-driven Multi-Agent Architecture**.

This repository is the initial foundation for an artifact-driven multi-agent system.

## Current scope

This first implementation only includes the minimum foundation:

- TypeScript / Node.js project setup
- SQLite storage using `better-sqlite3`
- Common `Artifact<TPayload>` type
- Artifact persistence repository
- Dependency tracking between artifacts
- A small smoke-test entrypoint

LLM calls, agent roles, skills, Slack integration, cron jobs, Wacha integration, and MCP exposure are intentionally not included yet.

## Directory structure

```text
suama/
├── db/
│   └── schema.sql
├── src/
│   ├── artifacts/
│   │   ├── repository/
│   │   │   └── artifactRepository.ts
│   │   ├── schema/
│   │   │   └── base.ts
│   │   └── storage/
│   │       └── sqlite.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Artifact model

Artifacts are the primary contract between AI systems.

```ts
type Artifact<TPayload> = {
  id: string;
  type: string;
  version: number;
  title: string;
  createdAt: string;
  createdBy: string;
  status: "draft" | "reviewed" | "approved";
  inputArtifactIds: string[];
  summary?: string;
  payload: TPayload;
};
```

The common metadata is stored in columns, and each artifact-specific payload is stored as JSON.

## SQLite schema

The initial schema has two tables:

- `artifacts`: stores artifact metadata and payload JSON
- `artifact_inputs`: stores dependencies between artifacts

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

This creates `suama.db`, inserts a sample artifact, reads it back, and prints it to the console.

## Type check

```bash
npm run typecheck
```

## Next steps

Recommended next steps:

1. Add concrete artifact schemas such as `MarketInsight` and `StrategyBrief`.
2. Add `agents/**/role.md` and `skills/*.md` files.
3. Add LLM execution wrappers such as `runIntel()` and `runStrategy()`.
4. Add a `market_research_cycle.ts` job.
5. Add validation for model-generated JSON.
