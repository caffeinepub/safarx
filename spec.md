# Specification

## Summary
**Goal:** Fix the admin dashboard enquiries loading failure and add community statistics display.

**Planned changes:**
- Debug and fix the enquiries fetch in `Admin.tsx` and `useQueries.ts` to correctly call the backend method, use an `enabled: !!actor` guard, and properly map the returned data to the card/table display.
- Add `getCommunityStats()` and `getAllCommunityUsers()` query functions to `backend/main.mo`, reading from the existing stable `communityUsers` map without exposing `passwordHash`.
- Add `useCommunityStats` and `useCommunityUserList` React Query hooks in `useQueries.ts`, both guarded with `enabled: !!actor`.
- Add a "Community Stats" section to `Admin.tsx` showing total member count, total post count, and a scrollable list of community users (display name + username), with loading skeletons and error states, styled consistently with the SafarX.in warm-earthy theme.

**User-visible outcome:** The admin dashboard successfully loads and displays all enquiries, and shows a new Community Stats section with member/post counts and a user list.
