export interface LocalLlmClient {
  name: "local-rule-engine";
}

export function getLlmClient(): LocalLlmClient {
  return { name: "local-rule-engine" };
}
