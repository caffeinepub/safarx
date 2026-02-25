import { useState } from 'react';
import { LogOut, Trash2, Calendar, User, BookOpen, Mail, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPostsByUser, useGetUserProfile, useDeletePost, type CommunitySession } from '@/hooks/useQueries';
import type { PostRecord } from '@/backend';

interface Props {
    session: CommunitySession;
    onLogout: () => void;
}

function formatDate(nanoseconds: bigint): string {
    const ms = Number(nanoseconds) / 1_000_000;
    return new Date(ms).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

interface ProfilePostCardProps {
    post: PostRecord;
    session: CommunitySession;
}

function ProfilePostCard({ post, session }: ProfilePostCardProps) {
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const deleteMutation = useDeletePost();

    const handleDeleteConfirm = async () => {
        setDeleteError('');
        // For Google users, use the sentinel password
        const passwordToUse = session.isGoogleUser ? 'GOOGLE_AUTH' : deletePassword;

        if (!session.isGoogleUser && !deletePassword) {
            setDeleteError('Please enter your password.');
            return;
        }
        try {
            const result = await deleteMutation.mutateAsync({
                postId: post.postId,
                requesterId: session.userId,
                password: passwordToUse,
            });
            if (!result.ok) {
                setDeleteError(result.message || 'Failed to delete post.');
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes('Invalid credentials')) {
                setDeleteError('Incorrect password.');
            } else {
                setDeleteError('Failed to delete post. Please try again.');
            }
        }
    };

    return (
        <div className="bg-white rounded-xl border border-terracotta-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-display font-bold text-terracotta-800 text-base leading-snug">
                            {post.title}
                        </h4>
                        {post.destination && (
                            <Badge
                                variant="outline"
                                className="text-xs font-body border-saffron-300 text-saffron-700 bg-saffron-50"
                            >
                                {post.destination}
                            </Badge>
                        )}
                    </div>
                    <p className="font-body text-terracotta-600 text-sm line-clamp-2 leading-relaxed">
                        {post.body}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-terracotta-400 font-body">
                        <span>❤️ {post.likes.toString()} likes</span>
                        <span>·</span>
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
                <button
                    onClick={() => { setShowDeletePrompt(!showDeletePrompt); setDeleteError(''); setDeletePassword(''); }}
                    className="shrink-0 p-2 text-terracotta-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete post"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {showDeletePrompt && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="font-body text-sm text-red-700 mb-2 font-medium">
                        {session.isGoogleUser
                            ? 'Are you sure you want to delete this post?'
                            : 'Enter your password to delete this post:'}
                    </p>
                    <div className="flex gap-2">
                        {!session.isGoogleUser && (
                            <input
                                type="password"
                                placeholder="Your password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                className="flex-1 px-3 py-1.5 text-sm border border-red-200 rounded-lg font-body focus:outline-none focus:border-red-400 bg-white"
                            />
                        )}
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-body font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1"
                        >
                            {deleteMutation.isPending ? (
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Delete'}
                        </button>
                        <button
                            onClick={() => { setShowDeletePrompt(false); setDeleteError(''); setDeletePassword(''); }}
                            className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-sm font-body rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                    {deleteError && (
                        <p className="mt-2 text-xs text-red-600 font-body">{deleteError}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function CommunityProfile({ session, onLogout }: Props) {
    const { data: profile, isLoading: profileLoading } = useGetUserProfile(session.userId);
    const { data: posts, isLoading: postsLoading } = useGetPostsByUser(session.userId);

    const isGoogleUser = session.isGoogleUser === true;
    // For Google users, username is their Gmail address
    const isGmailUsername = isGoogleUser && session.username.includes('@');

    return (
        <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-terracotta-100 overflow-hidden shadow-sm">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-terracotta-800 to-terracotta-700 px-6 py-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-saffron-400 border-2 border-saffron-300 flex items-center justify-center shadow-md">
                                <span className="font-display font-bold text-2xl text-terracotta-900">
                                    {session.displayName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-display text-2xl font-bold text-ivory-100">
                                    {session.displayName}
                                </h2>
                                {isGoogleUser ? (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-saffron-300" />
                                        <span className="font-body text-saffron-300 text-xs font-medium">
                                            Google Account
                                        </span>
                                    </div>
                                ) : (
                                    <p className="font-body text-ivory-300 text-sm">
                                        @{session.username}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-ivory-200 hover:text-ivory-100 font-body text-sm font-medium rounded-full transition-colors border border-white/20"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Account Identifier Row */}
                {isGmailUsername && (
                    <div className="px-6 py-3 bg-saffron-50 border-b border-saffron-100 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-saffron-600 shrink-0" />
                        <div>
                            <span className="font-body text-xs text-saffron-600 font-medium uppercase tracking-wide">
                                Gmail Account
                            </span>
                            <p className="font-body text-terracotta-700 text-sm font-medium">
                                {session.username}
                            </p>
                        </div>
                    </div>
                )}

                {/* Profile Stats */}
                <div className="px-6 py-4 flex items-center gap-6 border-b border-terracotta-50">
                    {profileLoading ? (
                        <Skeleton className="h-4 w-40" />
                    ) : profile ? (
                        <>
                            <div className="flex items-center gap-1.5 text-terracotta-500 font-body text-sm">
                                <Calendar className="w-4 h-4 text-saffron-500" />
                                <span>Member since {formatDate(profile.joinedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-terracotta-500 font-body text-sm">
                                <BookOpen className="w-4 h-4 text-saffron-500" />
                                <span>{posts?.length ?? 0} stories shared</span>
                            </div>
                        </>
                    ) : null}
                </div>

                {/* Bio (if any) */}
                {profile?.bio && (
                    <div className="px-6 py-3 border-b border-terracotta-50">
                        <p className="font-body text-terracotta-600 text-sm italic">"{profile.bio}"</p>
                    </div>
                )}
            </div>

            {/* My Posts */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-saffron-500" />
                    <h3 className="font-display text-lg font-bold text-terracotta-800">My Stories</h3>
                </div>

                {postsLoading && (
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-terracotta-100 p-4 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3.5 w-full" />
                                <Skeleton className="h-3.5 w-4/5" />
                            </div>
                        ))}
                    </div>
                )}

                {!postsLoading && (!posts || posts.length === 0) && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-terracotta-100">
                        <BookOpen className="w-10 h-10 text-saffron-300 mx-auto mb-3" />
                        <p className="font-display text-lg font-bold text-terracotta-700 mb-1">No stories yet</p>
                        <p className="font-body text-terracotta-500 text-sm">
                            Head to the Feed tab to share your first travel story!
                        </p>
                    </div>
                )}

                {!postsLoading && posts && posts.length > 0 && (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <ProfilePostCard key={post.postId.toString()} post={post} session={session} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
