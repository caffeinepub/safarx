# SafarX

## Current State
Community posts have a `likes` count stored in the backend, but share counts are stored in localStorage only — meaning they reset on different devices or browsers.

## Requested Changes (Diff)

### Add
- `shareCounts` field (`shareCount : Nat`) to `CommunityPost` type in backend
- `incrementShareCount(postId: Nat)` public shared function in backend that increments and returns the updated share count

### Modify
- `CommunityFeed.tsx` ShareButton component: replace localStorage-based share count logic with a backend call to `incrementShareCount` when user shares; read `post.shareCount` directly from the post record instead of localStorage

### Remove
- `SHARE_COUNTS_KEY` localStorage constant and related `getStoredShareCounts` helper in `CommunityFeed.tsx`

## Implementation Plan
1. Add `shareCount : Nat` field to `CommunityPost` type (default 0 on creation)
2. Add `incrementShareCount(postId : Nat) : async { ok : Bool; shareCount : Nat }` to backend
3. Update frontend `ShareButton` to use `post.shareCount` as initial value, call `incrementShareCount` on any share action, and remove localStorage logic
4. Wire new `useIncrementShareCount` mutation hook in `useQueries.ts`
