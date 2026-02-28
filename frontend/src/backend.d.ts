import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    bio: string;
    displayName: string;
}
export type Time = bigint;
export interface RegistrationResponse {
    ok: boolean;
    message: string;
}
export interface PostRecord {
    title: string;
    destination: string;
    authorId: bigint;
    body: string;
    createdAt: bigint;
    likes: bigint;
    imageUrl: string;
    authorDisplayName: string;
    postId: bigint;
}
export interface UserProfilePublic {
    bio: string;
    displayName: string;
    userId: bigint;
    joinedAt: bigint;
}
export interface AdminProfile {
    principal: string;
    username: string;
}
export type SessionToken = string;
export interface Inquiry {
    id: string;
    destination: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface LoginResponse {
    ok: boolean;
    displayName: string;
    userId: bigint;
    message: string;
}
export interface SessionResponse {
    ok: boolean;
    token: SessionToken;
    message: string;
}
export interface PostResponse {
    ok: boolean;
    postId: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeUserPassword(userId: bigint, oldPassword: string, newPassword: string): Promise<boolean>;
    createPost(authorId: bigint, password: string, title: string, body: string, imageUrl: string, destination: string): Promise<PostResponse>;
    deleteInquiry(id: string, legacyToken: string | null): Promise<void>;
    deletePost(postId: bigint, requesterId: bigint, password: string): Promise<{
        ok: boolean;
        message: string;
    }>;
    getAllCommunityUsers(): Promise<Array<{
        username: string;
        displayName: string;
        userId: bigint;
        joinedAt: bigint;
    }>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllInquiriesSortedByDestination(): Promise<Array<Inquiry>>;
    getAllPosts(): Promise<Array<PostRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCommunityStats(): Promise<{
        totalMembers: bigint;
        totalPosts: bigint;
    }>;
    getInquiriesByDestination(destination: string): Promise<Array<Inquiry>>;
    getInquiry(id: string): Promise<Inquiry>;
    getPostsByUser(userId: bigint): Promise<Array<PostRecord>>;
    getProfileByPrincipal(user: Principal): Promise<UserProfile | null>;
    getUserProfile(userId: bigint): Promise<UserProfilePublic | null>;
    isAdminSession(token: SessionToken): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: bigint): Promise<{
        ok: boolean;
        likes: bigint;
    }>;
    loginAdmin(username: string, password: string): Promise<SessionResponse>;
    loginUser(username: string, password: string): Promise<LoginResponse>;
    registerAdmin(username: string, password: string): Promise<AdminProfile>;
    registerUser(username: string, password: string, displayName: string, isGoogleUser: boolean): Promise<RegistrationResponse>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, email: string, destination: string, message: string, phone: string): Promise<void>;
    updateUserProfile(userId: bigint, displayName: string, bio: string, password: string): Promise<void>;
}
