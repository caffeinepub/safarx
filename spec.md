# Specification

## Summary
**Goal:** Add Google Analytics 4 tracking to the SafarX frontend by inserting the gtag.js snippet into the HTML head.

**Planned changes:**
- Insert the GA4 gtag.js script tag (Measurement ID: G-73VJ1TQ3D7) as the first child inside `<head>` in `frontend/index.html`
- Add the inline gtag configuration script immediately after the async gtag.js script tag
- Ensure no duplicate Google tag snippets exist in the file

**User-visible outcome:** Google Analytics 4 will track all page visits on the SafarX website using Measurement ID G-73VJ1TQ3D7.
