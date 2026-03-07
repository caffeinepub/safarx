import type {
  GeneratedItinerary,
  GroupType,
  TravelStyle,
} from "@/utils/itineraryGenerator";

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

export interface FullItineraryParams {
  destinationId: string;
  destinationName: string;
  state: string;
  duration: number;
  travelStyle: TravelStyle;
  groupType: GroupType;
  highlights: string[];
  bestTimeToVisit: string;
  howToReach: string;
}

// Hardcoded API key
const GEMINI_API_KEY = "AIzaSyD81Qo5exM8wuXm6pscU2Pqqdi1G-zvvZE";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function buildExploreMorePrompt(params: ExploreMoreParams): string {
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

function buildFullItineraryPrompt(params: FullItineraryParams): string {
  const highlightsList = params.highlights.slice(0, 8).join(", ");
  return `You are an expert India travel planner for SafarX. Create a detailed ${params.duration}-day itinerary for ${params.destinationName}, ${params.state}.

Travel style: ${params.travelStyle}
Group type: ${params.groupType}
Known highlights: ${highlightsList}
Best time to visit: ${params.bestTimeToVisit}
How to reach: ${params.howToReach}

CRITICAL RULES:
- NO duplicate place names anywhere in the entire itinerary
- Each activity must reference a DIFFERENT specific location/attraction
- Include hidden gems, offbeat spots, and local favourites — not just famous tourist sites
- Use real, specific place names in ${params.destinationName}
- Day 1 theme must be "Arrival & First Impressions"
- Last day (Day ${params.duration}) theme must be "Farewell & Memories"
- 3 activities per day: Morning, Afternoon, Evening
- 5-6 practical tips tailored for ${params.groupType} travellers
- Tips should be specific to ${params.destinationName}

Respond with ONLY raw JSON (no markdown fences, no explanation):

{
  "destination": "${params.destinationName}",
  "duration": ${params.duration},
  "travelStyle": "${params.travelStyle}",
  "groupType": "${params.groupType}",
  "days": [
    {
      "day": 1,
      "theme": "Arrival & First Impressions",
      "activities": [
        {
          "time": "Morning",
          "title": "Specific place name",
          "description": "2-3 sentences describing what to do and why it is special",
          "icon": "🌅"
        },
        {
          "time": "Afternoon",
          "title": "Different specific place name",
          "description": "2-3 sentences",
          "icon": "☀️"
        },
        {
          "time": "Evening",
          "title": "Another different place name",
          "description": "2-3 sentences",
          "icon": "🌙"
        }
      ]
    }
  ],
  "tips": [
    "Tip 1 specific to ${params.destinationName} for ${params.groupType}",
    "Tip 2",
    "Tip 3",
    "Tip 4",
    "Tip 5"
  ],
  "bestTimeToVisit": "${params.bestTimeToVisit}",
  "howToReach": "${params.howToReach}"
}`;
}

export async function fetchExploreMore(
  params: ExploreMoreParams,
): Promise<ExploreMoreResult> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildExploreMorePrompt(params) }],
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
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip any markdown code fences if present
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  let parsed: ExploreMoreResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Failed to parse Gemini response as JSON. The model returned unexpected output.",
    );
  }

  // Basic validation
  if (!parsed.intro || !Array.isArray(parsed.suggestions) || !parsed.localTip) {
    throw new Error("Gemini response is missing required fields.");
  }

  return parsed;
}

export async function generateFullItinerary(
  params: FullItineraryParams,
): Promise<GeneratedItinerary> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: buildFullItineraryPrompt(params) }],
        },
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawText: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip markdown fences if present
  const cleaned = rawText
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  let parsed: GeneratedItinerary;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Failed to parse Gemini itinerary response as JSON. Raw: ${cleaned.slice(0, 200)}`,
    );
  }

  // Basic validation
  if (
    !parsed.destination ||
    !Array.isArray(parsed.days) ||
    parsed.days.length === 0
  ) {
    throw new Error("Gemini returned an incomplete itinerary structure.");
  }

  // Enforce no duplicate activity titles
  const seen = new Set<string>();
  for (const day of parsed.days) {
    for (const act of day.activities) {
      const key = act.title.toLowerCase().trim();
      if (seen.has(key)) {
        act.title = `${act.title} — ${day.day === 1 ? "Arrival Day" : `Day ${day.day}`}`;
      }
      seen.add(act.title.toLowerCase().trim());
    }
  }

  return parsed;
}
