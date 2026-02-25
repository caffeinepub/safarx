import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    id: string;
    destination: string;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
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
export interface LoginResponse {
    ok: boolean;
    displayName: string;
    userId: bigint;
    message: string;
}
export interface PostResponse {
    ok: boolean;
    postId: bigint;
}
export interface UserProfilePublic {
    bio: string;
    displayName: string;
    userId: bigint;
    joinedAt: bigint;
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
    deleteInquiry(id: string): Promise<void>;
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
    getCallerUserRole(): Promise<UserRole>;
    getCommunityStats(): Promise<{
        totalMembers: bigint;
        totalPosts: bigint;
    }>;
    getInquiriesByDestination(destination: string): Promise<Array<Inquiry>>;
    getInquiry(id: string): Promise<Inquiry>;
    getPostsByUser(userId: bigint): Promise<Array<PostRecord>>;
    getUserProfile(userId: bigint): Promise<UserProfilePublic | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: bigint): Promise<{
        ok: boolean;
        likes: bigint;
    }>;
    loginUser(username: string, password: string): Promise<LoginResponse>;
    registerUser(username: string, password: string, displayName: string, isGoogleUser: boolean): Promise<RegistrationResponse>;
    submitInquiry(name: string, email: string, destination: string, message: string, phone: string): Promise<void>;
    updateUserProfile(userId: bigint, displayName: string, bio: string, password: string): Promise<void>;
}
