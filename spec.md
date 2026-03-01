# Specification

## Summary
**Goal:** Add a PDF download button for generated itineraries and a Gemini-powered "Explore More" section on the PlanTrip page.

**Planned changes:**
- Add a "Download PDF" button to the itinerary results view (ItineraryTimeline component) that generates and downloads a formatted PDF client-side, including destination name, duration, travel style, and full day-by-day activity breakdown (Morning/Afternoon/Evening).
- Add an "Explore More" section below the generated itinerary on the PlanTrip page that calls the Google Gemini API with the selected destination, duration, travel style, and group type to display personalized travel suggestions, local tips, and hidden insights.
- Show a loading state while the Gemini API call is in progress and display a graceful error message if the call fails.
- Style both new features consistently with SafarX's warm earthy design theme (saffron, terracotta, ivory, teal).

**User-visible outcome:** After generating a trip plan, users can download their itinerary as a clean PDF and view AI-powered personalized travel insights and local tips for their destination.
