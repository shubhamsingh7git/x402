import { SYSTEM_PROMPT } from "./system.prompt";

export const buildSummaryPrompt = (query: string, memoryData: Record<string, unknown>): string => {
  return `
${SYSTEM_PROMPT}

Task: Synthesize a comprehensive executive fiduciary report based on the collected execution memory.

User Query: "${query}"

Execution Memory Data:
${JSON.stringify(memoryData, null, 2)}

Return a structured JSON object:
{
  "title": "Executive Research Report",
  "summary": "Detailed narrative summary text...",
  "keyTakeaways": ["Point 1", "Point 2", "Point 3"],
  "riskAssessment": "Low / Moderate / High with explanation",
  "fiduciaryRecommendation": "Recommendation statement"
}
`;
};
