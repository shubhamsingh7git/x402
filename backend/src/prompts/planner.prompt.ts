import { SYSTEM_PROMPT } from "./system.prompt";

export const buildPlannerPrompt = (userQuery: string): string => {
  return `
${SYSTEM_PROMPT}

Task: Decompose the following user research query into a sequence of execution steps.

User Query: "${userQuery}"

Allowed Step Types:
- "SEARCH": Web search and news intelligence collection.
- "FINANCIAL_DATA": Financial metrics, revenue, valuation, or market data extraction.
- "SUMMARY": Synthesis of collected data into a final fiduciary report.

Required JSON Structure:
{
  "steps": [
    {
      "id": 1,
      "type": "SEARCH",
      "title": "Short descriptive step title",
      "input": { "query": "specific search string" }
    },
    {
      "id": 2,
      "type": "FINANCIAL_DATA",
      "title": "Short descriptive step title",
      "input": { "company": "subject name" }
    },
    {
      "id": 3,
      "type": "SUMMARY",
      "title": "Synthesize Executive Fiduciary Brief",
      "input": { "topic": "subject" }
    }
  ]
}

DO NOT generate the final answer or summary content. Generate ONLY the step plan array.
`;
};
