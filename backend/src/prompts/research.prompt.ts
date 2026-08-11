import { SYSTEM_PROMPT } from "./system.prompt";

export const buildResearchPrompt = (topic: string, context?: Record<string, unknown>): string => {
  return `
${SYSTEM_PROMPT}

Task: Formulate expanded research criteria for topic: "${topic}".
Context: ${JSON.stringify(context || {})}

Return a structured JSON object with key research angles.
`;
};
