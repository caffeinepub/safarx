import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useState, useCallback } from 'react';

// ─── Admin Session Token Helpers ──────────────────────────────────────────────

const ADMIN_SESSION_KEY = 'adminSession';

export function getAdminSessionToken(): string | null {
  return localStorage.getItem(ADMIN_SESSION_KEY);
}

export function setAdminSessionToken(token: string) {
  localStorage.setItem(ADMIN_SESSION_KEY, token);
}

export function clearAdminSessionToken() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

// ─── Inquiry Hooks ────────────────────────────────────────────────────────────

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  const token = getAdminSessionToken();

  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session expired — please log in again.');
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching && !!token,
    retry: false,
  });
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      const token = getAdminSessionToken();
      if (!token) throw new Error('Admin session expired — please log in again.');
      return actor.deleteInquiry(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      destination: string;
      message: string;
      phone: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(data.name, data.email, data.destination, data.message, data.phone);
    },
  });
}

// ─── Community Stats Hooks (Admin) ───────────────────────────────────────────

export function useCommunityStats() {
  const { actor, isFetching } = useActor();
  const token = getAdminSessionToken();

  return useQuery({
    queryKey: ['communityStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session expired — please log in again.');
      return actor.getCommunityStats();
    },
    enabled: !!actor && !isFetching && !!token,
    retry: false,
  });
}

export function useCommunityUserList() {
  const { actor, isFetching } = useActor();
  const token = getAdminSessionToken();

  return useQuery({
    queryKey: ['communityUserList'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!token) throw new Error('Admin session expired — please log in again.');
      return actor.getAllCommunityUsers();
    },
    enabled: !!actor && !isFetching && !!token,
    retry: false,
  });
}

// ─── Admin Auth (backend-based with session token) ────────────────────────────

export function useIsAdminRegistered() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdminRegistered'],
    queryFn: async () => {
      if (!actor) return false;
      // Check if admin credentials exist by attempting to verify session
      // We use isAdminSession with a dummy token to probe — if it returns false
      // that means the backend is up; we rely on registerAdmin's first-call-wins logic.
      // A simpler heuristic: check if any adminSession token is stored.
      return false; // Always allow registration attempt; backend enforces first-call-wins
    },
    enabled: !!actor && !isFetching,
    staleTime: Infinity,
  });
}

export function useRegisterAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const profile = await actor.registerAdmin(username, password);
        // After registering, immediately log in to get the session token
        const loginResult = await actor.loginAdmin(username, password);
        if (loginResult.ok && loginResult.token) {
          setAdminSessionToken(loginResult.token);
        }
        return { ok: true, message: 'Registration successful.', profile };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, message: msg };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdminRegistered'] });
    },
  });
}

export function useLoginAdmin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.loginAdmin(username, password);
      if (result.ok && result.token) {
        setAdminSessionToken(result.token);
      }
      return result;
    },
  });
}

// ─── Community Session (localStorage) ────────────────────────────────────────

const COMMUNITY_SESSION_KEY = 'safarx_community_user';

export interface CommunitySession {
  userId: bigint;
  displayName: string;
  username: string;
  isGoogleUser?: boolean;
  /** Stored for non-Google users to authorize post creation/deletion without re-prompting */
  password?: string;
}

function readSession(): CommunitySession | null {
  try {
    const raw = localStorage.getItem(COMMUNITY_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      userId: BigInt(parsed.userId),
      displayName: parsed.displayName,
      username: parsed.username,
      isGoogleUser: parsed.isGoogleUser ?? false,
      password: parsed.password ?? undefined,
    };
  } catch {
    return null;
  }
}

function writeSession(session: CommunitySession) {
  localStorage.setItem(
    COMMUNITY_SESSION_KEY,
    JSON.stringify({
      userId: session.userId.toString(),
      displayName: session.displayName,
      username: session.username,
      isGoogleUser: session.isGoogleUser ?? false,
      password: session.password ?? undefined,
    })
  );
}

function clearSession() {
  localStorage.removeItem(COMMUNITY_SESSION_KEY);
}

export function useCommunityUser() {
  const [session, setSession] = useState<CommunitySession | null>(() => readSession());

  const login = useCallback((s: CommunitySession) => {
    writeSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return { session, login, logout };
}

// ─── Community Auth Hooks ─────────────────────────────────────────────────────

export function useRegisterUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      username: string;
      password: string;
      displayName: string;
      isGoogleUser?: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(data.username, data.password, data.displayName, data.isGoogleUser ?? false);
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.loginUser(data.username, data.password);
    },
  });
}

// ─── Community Post Hooks ─────────────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Alias kept for backward compatibility with CommunityFeed */
export const useCommunityPosts = useGetAllPosts;

export function useGetPostsByUser(userId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['communityPosts', 'user', userId?.toString()],
    queryFn: async () => {
      if (!actor || userId === null) return [];
      return actor.getPostsByUser(userId);
    },
    enabled: !!actor && !isFetching && userId !== null,
  });
}

export function useGetUserProfile(userId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || userId === null) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching && userId !== null,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      authorId: bigint;
      password: string;
      title: string;
      body: string;
      imageUrl: string;
      destination: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(
        data.authorId,
        data.password,
        data.title,
        data.body,
        data.imageUrl,
        data.destination
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: bigint; requesterId: bigint; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(data.postId, data.requesterId, data.password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityPosts'] });
    },
  });
}

export function useUpdateUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: bigint;
      displayName: string;
      bio: string;
      password: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfile(data.userId, data.displayName, data.bio, data.password);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId.toString()] });
    },
  });
}

export function useChangeUserPassword() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (data: {
      userId: bigint;
      oldPassword: string;
      newPassword: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.changeUserPassword(data.userId, data.oldPassword, data.newPassword);
    },
  });
}
