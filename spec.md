# Specification

## Summary
**Goal:** Add Google Analytics tracking (G-73VJ1TQ3D7) to the SafarX application so it loads on every page.

**Planned changes:**
- Insert the `gtag.js` async script tag and the inline gtag configuration script (with tracking ID `G-73VJ1TQ3D7`) immediately after the opening `<head>` tag in `frontend/index.html`
- Ensure no duplicate Google tag scripts exist in `frontend/index.html`

**User-visible outcome:** Google Analytics will silently track all page visits across the entire SafarX application (Home, Destinations, Packages, PlanTrip, Contact, Community, Admin, etc.) via the single `index.html` entry point.
