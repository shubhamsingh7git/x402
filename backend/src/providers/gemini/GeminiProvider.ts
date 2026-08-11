import { env } from "../../config/env";
import { logger } from "../../utils/logger";

export interface GeneratedPlanStep {
  id: number;
  type: string;
  input: Record<string, unknown>;
  title?: string;
}

export interface GeneratedPlan {
  steps: GeneratedPlanStep[];
}

export class GeminiProvider {
  private static instance: GeminiProvider;
  private apiKey: string;
  private model: string;
  private timeoutMs: number;
  private maxRetries: number;

  private constructor() {
    this.apiKey = env.GEMINI_API_KEY;
    this.model = env.GEMINI_MODEL;
    this.timeoutMs = env.GEMINI_TIMEOUT_MS;
    this.maxRetries = env.GEMINI_MAX_RETRIES;
  }

  public static getInstance(): GeminiProvider {
    if (!GeminiProvider.instance) {
      GeminiProvider.instance = new GeminiProvider();
    }
    return GeminiProvider.instance;
  }

  public getModelName(): string {
    return this.model;
  }

  async generateJSON<T>(prompt: string, retries = this.maxRetries): Promise<T> {
    if (!this.apiKey) {
      logger.warn("⚠️ GEMINI_API_KEY not configured in .env. Using fallback plan generator.");
      return this.getFallbackPlan(prompt) as unknown as T;
    }

    let attempt = 0;
    while (attempt <= retries) {
      try {
        attempt++;
        logger.debug(`🤖 Calling Gemini API (attempt ${attempt}/${retries + 1})...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt}\n\nIMPORTANT: Output ONLY valid raw JSON. Do not wrap in markdown code blocks or add explanatory text.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
        }

        const data = (await response.json()) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error("Empty response payload from Gemini API");
        }

        // Clean any codeblock formatting if present
        const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText) as T;
        return parsed;
      } catch (error: any) {
        logger.warn({ err: error.message }, `Gemini API attempt ${attempt} failed.`);
        if (attempt > retries) {
          logger.warn("⚠️ Gemini retries exhausted. Using fallback plan generator.");
          return this.getFallbackPlan(prompt) as unknown as T;
        }
        // Brief delay before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return this.getFallbackPlan(prompt) as unknown as T;
  }

  private getFallbackPlan(prompt: string): GeneratedPlan {
    // Extracts subject from prompt if possible
    let target = "Target Subject";
    if (prompt.toLowerCase().includes("tesla")) target = "Tesla AI Strategy";
    else if (prompt.toLowerCase().includes("openai")) target = "OpenAI Ecosystem";
    else if (prompt.toLowerCase().includes("market")) target = "Global Crypto Market";

    return {
      steps: [
        {
          id: 1,
          type: "SEARCH",
          title: `Search Latest Web Intelligence on ${target}`,
          input: { query: `${target} recent updates and strategy` },
        },
        {
          id: 2,
          type: "FINANCIAL_DATA",
          title: `Extract Financial Metrics & Market Performance for ${target}`,
          input: { company: target, metrics: ["revenue", "growth", "valuation"] },
        },
        {
          id: 3,
          type: "SUMMARY",
          title: `Synthesize Fiduciary Report & Executive Summary for ${target}`,
          input: { topic: target, format: "executive_brief" },
        },
      ],
    };
  }
}

export const geminiProvider = GeminiProvider.getInstance();
