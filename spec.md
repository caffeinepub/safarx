# Specification

## Summary
**Goal:** Fix admin principal storage and session token verification in the backend, and update the frontend to pass session tokens for all admin-gated calls.

**Planned changes:**
- In `backend/main.mo`, store `Principal.toText(msg.caller)` in a stable variable when `registerAdmin` is called.
- Update `loginAdmin` to return `{ok: true; token: <sessionToken>}` on success and `{ok: false; token: ""}` on failure.
- Add dual-mode guards to all admin-gated functions (`getAllInquiries`, `deleteInquiry`, `getCommunityStats`, `getAllCommunityUsers`) that validate either a session token parameter or the caller principal against the stored admin principal.
- Remove any checks against uninitialised or hardcoded principal values.
- In `frontend/src/hooks/useQueries.ts` and `frontend/src/pages/Admin.tsx`, update all admin-gated actor calls to pass the session token from localStorage as a parameter.
- Replace the "Your identity does not have admin permissions…" error message with "Admin session expired — please log in again." and redirect to `/admin/login` when the token is missing or invalid.

**User-visible outcome:** After logging in as admin, the dashboard correctly loads enquiries, community stats, and user lists, and deleting an enquiry works without any permissions error. If the session expires, the admin sees a friendly message and is redirected to the login page.
