import type { MarketInsightPayload } from "../artifacts/schema/marketInsight.js";
import type { StrategyBriefPayload } from "../artifacts/schema/strategyBrief.js";

interface IntelInput {
  topic: string;
  targetMarket: string;
  period: string;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error(`Mock LLM could not find JSON input in: ${text}`);
  }
  const raw = text.slice(start, end + 1);
  return JSON.parse(raw) as Record<string, unknown>;
}

function mockMarketInsight(input: IntelInput): MarketInsightPayload {
  return {
    topic: input.topic,
    targetMarket: input.targetMarket,
    period: input.period,
    findings: [
      {
        category: "trend",
        title: "AI support automation adoption is accelerating",
        detail: "SMB SaaS teams are introducing AI copilots to reduce first-response time and ticket load.",
        confidence: "medium",
      },
      {
        category: "user_need",
        title: "Operators need controllable automation",
        detail: "Users want approval workflows, escalation rules, and transparent handoff to humans.",
        confidence: "high",
      },
      {
        category: "competitor",
        title: "Platform bundles are increasing",
        detail: "Vendors are bundling chat, help center, and analytics to increase lock-in.",
        confidence: "medium",
      },
      {
        category: "risk",
        title: "Hallucination and compliance risk",
        detail: "Unreliable answers can hurt trust and create legal/compliance issues.",
        confidence: "high",
      },
      {
        category: "opportunity",
        title: "Workflow-first niche positioning",
        detail: "A workflow-first product can win where generic chatbots underperform.",
        confidence: "medium",
      },
    ],
    risks: [
      "Incorrect AI answers may damage support quality.",
      "Large competitors can copy core automation features quickly.",
    ],
    opportunities: [
      "Differentiate with governance and escalation control.",
      "Target teams that need high trust customer support operations.",
    ],
    recommendedFocus: [
      "Human-in-the-loop workflows",
      "Quality monitoring and guardrails",
      "Fast integration with existing support stack",
    ],
  };
}

function mockStrategyBrief(input: MarketInsightPayload): StrategyBriefPayload {
  return {
    targetUser: `${input.targetMarket} support manager`,
    problem: "Current support operations are costly and slow, but full automation is hard to trust.",
    valueProposition:
      "Deliver reliable AI-assisted support with explicit control points, reducing response time while preserving quality.",
    differentiation:
      "Workflow-first automation with approval gates, confidence-aware routing, and built-in QA dashboards.",
    kpis: [
      {
        name: "First response time",
        target: "-30% within 3 months",
        reason: "Directly reflects support speed improvements expected from AI-assisted triage.",
      },
      {
        name: "AI-resolved ticket ratio",
        target: ">35% on eligible tickets",
        reason: "Measures practical automation adoption without requiring full autonomy.",
      },
      {
        name: "Escalation error rate",
        target: "<3%",
        reason: "Ensures trust by monitoring unsafe or incorrect automation decisions.",
      },
    ],
    strategicNotes: [
      "Start with low-risk ticket categories to establish reliability.",
      "Pair automation launch with a strict quality review loop.",
      "Use integration speed as a wedge in SMB segments.",
    ],
  };
}

export function generateMockJson<T>(inputText: string): T {
  const parsed = extractJsonObject(inputText);

  if (typeof parsed.topic === "string" && typeof parsed.targetMarket === "string" && typeof parsed.period === "string") {
    return mockMarketInsight(parsed as unknown as IntelInput) as T;
  }

  if (
    typeof parsed.topic === "string" &&
    typeof parsed.targetMarket === "string" &&
    typeof parsed.period === "string" &&
    Array.isArray(parsed.findings)
  ) {
    return mockStrategyBrief(parsed as unknown as MarketInsightPayload) as T;
  }

  throw new Error(`Mock LLM received unsupported input shape: ${JSON.stringify(parsed)}`);
}
