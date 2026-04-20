import { randomUUID } from "node:crypto";

export function createId(prefix: string): string {
  const short = randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}_${short}`;
}
