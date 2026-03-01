# Specification

## Summary
**Goal:** Fix duplicate places in the AI trip planner, expand hidden gem destinations, add PDF download for itineraries, and integrate Gemini API for enriched destination suggestions.

**Planned changes:**
- Fix duplicate activity/place names in `itineraryGenerator.ts` by deduplicating entries before returning the final itinerary
- Add at least 15 new hidden gem Indian destinations (spanning North, South, East, West, Northeast regions) to `destinations.ts` and `itineraryGenerator.ts`, each with full metadata and a "Hidden Gem" tag
- Add a "Download PDF" button to the itinerary result view (`PlanTrip.tsx` / `ItineraryTimeline.tsx`) using a client-side PDF library; button is hidden/disabled when no itinerary is generated
- Integrate Google Gemini API (`VITE_GEMINI_API_KEY`) to fetch enriched destination data (hidden gems, local food, cultural experiences, travel tips) when generating an itinerary; display results in a dedicated "Explore More" section with loading state and graceful fallback

**User-visible outcome:** Users can generate itineraries with no duplicate places, discover many more hidden gem destinations across India, download a well-formatted PDF of their customized itinerary, and see AI-powered suggestions from Gemini alongside the standard itinerary.
