# Specification

## Summary
**Goal:** Fix the Connect Identity / Google Sign-In button on the Community page being hidden behind the fixed site header.

**Planned changes:**
- Increase the z-index of the CommunityAuthModal dialog/panel and its overlay so it renders above the fixed header
- Ensure the modal container has sufficient top offset or padding so the button is not obscured by the navigation bar
- Verify the trigger button and overlay are fully visible and clickable on both desktop and mobile viewports

**User-visible outcome:** Users can see and click the Google Sign-In / Connect Identity button on the Community page without it being covered by the site header.
