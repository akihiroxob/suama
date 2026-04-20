# SUAMA (System for Unified Artifact-driven Multi-Agent Architecture)

SUAMA は **Artifact-driven** なマルチエージェント実行基盤の最小実装です。  
このリポジトリでは、以下の 2 エージェント連携を最小構成で実現しています。

1. Intel AI が市場調査を実行し `MarketInsight` Artifact を生成
2. Strategy AI が `MarketInsight` を入力に `StrategyBrief` Artifact を生成
3. すべての Artifact を SQLite に保存

## Artifact-driven とは

SUAMA の中核は「AI 同士が直接会話するのではなく、Artifact を介して連携する」ことです。

- 各 AI は成果物を **Artifact** として出力
- 次の AI は前の Artifact を入力として利用
- 正本 (source of truth) は SQLite
- 外部連携（Slack / Wacha 等）はこの最小版では未実装

## ディレクトリ構成

```text
suama/
├── src/
│   ├── agents/                      # role.md / skill.md
│   ├── artifacts/
│   │   ├── schema/                 # Artifact 型定義
│   │   ├── repository/             # DB 永続化
│   │   └── storage/                # SQLite 初期化とスキーマ適用
│   ├── llm/                        # ローカルJSON生成
│   ├── utils/                      # ファイル読込・ID生成
│   ├── orchestrator/               # 各AIの実行関数
│   ├── jobs/                       # 業務ジョブ
│   └── main.ts                     # エントリーポイント
├── db/
│   └── schema.sql                  # SQLite スキーマ
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## セットアップ

```bash
npm install
cp .env.example .env
```

## `.env.example` の説明

- `DATABASE_PATH`: SQLite ファイルパス（任意。既定 `./db/suama.sqlite`）

```env
DATABASE_PATH=./db/suama.sqlite
```

## 実行方法

この最小構成は外部 API を使いません。ローカルで JSON を生成します。

```bash
npm run dev
```

## 起動時の流れ

1. SQLite 接続
2. `db/schema.sql` 適用（初回テーブル作成）
3. `market_research_cycle` 実行
4. Intel/Strategy の Artifact を保存し、結果を console 出力

## 何が保存されるか

以下 2 テーブルに保存されます。

- `artifacts`
  - Artifact 本体（メタ情報 + payload JSON）
- `artifact_inputs`
  - Artifact 間の入力依存（どの Artifact を参照したか）

この最小実装では、`StrategyBrief` が `MarketInsight` の `id` を `artifact_inputs` に記録します。

## 今後の拡張候補

- LegalAI 追加（法務レビュー Artifact）
- StoryArtifact 追加（ステークホルダー向け説明）
- Slack 通知連携
- ProductAI / ExecutionAI への多段拡張
- Zod による payload 検証
- ジョブスケジューリング（cron / queue）
