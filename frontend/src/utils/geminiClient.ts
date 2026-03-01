import type { TravelStyle, GroupType } from '@/utils/itineraryGenerator';

export interface ExploreMoreParams {
    destination: string;
    duration: number;
    travelStyle: TravelStyle;
    groupType: GroupType;
}

export interface GeminiSuggestion {
    category: string;
    emoji: string;
    title: string;
    description: string;
}

export interface ExploreMoreResult {
    intro: string;
    suggestions: GeminiSuggestion[];
    localTip: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt(params: ExploreMoreParams): string {
    return `You are a knowledgeable India travel expert for SafarX, a premium travel platform.

A traveller is planning a ${params.duration}-day ${params.travelStyle} trip to ${params.destination} as a ${params.groupType}.

Please provide personalised "Explore More" travel suggestions in the following strict JSON format (no markdown, no code blocks, just raw JSON):

{
  "intro": "A warm 1-2 sentence personalised intro about exploring ${params.destination} for a ${params.groupType} on a ${params.travelStyle} trip.",
  "suggestions": [
    {
      "category": "Category name (e.g. Hidden Gem, Local Food, Day Trip, Cultural Experience, Shopping)",
      "emoji": "A single relevant emoji",
      "title": "Short catchy title (max 8 words)",
      "description": "2-3 sentences of specific, actionable advice for ${params.destination}."
    }
  ],
  "localTip": "One specific insider tip about ${params.destination} that most tourists miss."
}

Provide exactly 4 suggestions. Make them specific to ${params.destination} and tailored for a ${params.groupType} travelling in ${params.travelStyle} style. Be specific, practical, and inspiring.`;
}

export async function fetchExploreMore(params: ExploreMoreParams): Promise<ExploreMoreResult> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: buildPrompt(params) }],
                },
            ],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 1024,
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip any markdown code fences if present
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    let parsed: ExploreMoreResult;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error('Failed to parse Gemini response as JSON. The model returned unexpected output.');
    }

    // Basic validation
    if (!parsed.intro || !Array.isArray(parsed.suggestions) || !parsed.localTip) {
        throw new Error('Gemini response is missing required fields.');
    }

    return parsed;
}
