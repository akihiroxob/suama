import { getLlmClient } from "./client.js";
import { generateMockJson } from "./mockGenerator.js";

export interface GenerateJsonInput {
  instructions: string;
  input: string;
}

export async function generateJson<T>(params: GenerateJsonInput): Promise<T> {
  const client = getLlmClient();

  try {
    return generateMockJson<T>(params.input);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to generate JSON with ${client.name}: ${message}\nRaw input:\n${params.input}\nInstructions:\n${params.instructions}`,
    );
  }
}
