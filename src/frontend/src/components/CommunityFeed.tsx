import type { PostRecord } from "@/backend";
import CreatePostModal from "@/components/CreatePostModal";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CommunitySession,
  useCommunityPosts,
  useDeletePost,
  useIncrementShareCount,
  useLikePost,
} from "@/hooks/useQueries";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  ImageOff,
  Link,
  MapPin,
  PenSquare,
  Share2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp, SiX } from "react-icons/si";

interface Props {
  session: CommunitySession | null;
  onLoginRequest: () => void;
}

function formatRelativeTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds) / 1_000_000;
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

interface PostCardProps {
  post: PostRecord;
  session: CommunitySession | null;
}

interface ShareButtonProps {
  post: PostRecord;
}

function ShareButton({ post }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [instagramCopied, setInstagramCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const incrementShareCount = useIncrementShareCount();

  const shareUrl = window.location.href;
  const shareText = `${post.title} by ${post.authorDisplayName} on SafarX - India's Travel Community`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const platforms = [
    {
      label: "WhatsApp",
      icon: <SiWhatsapp className="w-4 h-4" />,
      color: "text-green-600 bg-green-50 hover:bg-green-100 border-green-200",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      ocid: "post.share.whatsapp_button",
    },
    {
      label: "Facebook",
      icon: <SiFacebook className="w-4 h-4" />,
      color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      ocid: "post.share.facebook_button",
    },
    {
      label: "X (Twitter)",
      icon: <SiX className="w-4 h-4" />,
      color:
        "text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border-neutral-200",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      ocid: "post.share.twitter_button",
    },
  ];

  const handleCopy = async (key: "copy" | "instagram") => {
    incrementShareCount.mutate(post.postId);
    try {
      await navigator.clipboard.writeText(shareUrl);
      if (key === "instagram") {
        setInstagramCopied(true);
        setTimeout(() => setInstagramCopied(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (key === "instagram") {
        setInstagramCopied(true);
        setTimeout(() => setInstagramCopied(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <Popover open={shareOpen} onOpenChange={setShareOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-ocid="post.share_button"
          className="flex items-center gap-1.5 text-terracotta-600 hover:text-saffron-600 transition-colors text-xs font-body"
          aria-label="Share this post"
        >
          <Share2 className="w-4 h-4" />
          <span className="font-medium">
            {post.shareCount > 0n
              ? `Share · ${post.shareCount.toString()}`
              : "Share"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        data-ocid="post.share.popover"
        className="w-64 p-3"
        align="end"
        side="top"
      >
        <p className="font-body text-xs font-semibold text-terracotta-700 uppercase tracking-wide mb-2.5 px-0.5">
          Share this post
        </p>
        <div className="space-y-1.5">
          {/* Social platforms */}
          {platforms.map((p) => (
            <a
              key={p.label}
              data-ocid={p.ocid}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                incrementShareCount.mutate(post.postId);
                setShareOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border text-sm font-body font-medium transition-colors ${p.color}`}
            >
              {p.icon}
              {p.label}
            </a>
          ))}

          {/* Instagram — copy link */}
          <button
            type="button"
            data-ocid="post.share.instagram_button"
            onClick={() => handleCopy("instagram")}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border text-sm font-body font-medium transition-colors text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200"
          >
            <SiInstagram className="w-4 h-4" />
            {instagramCopied ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Copied for Instagram!
              </span>
            ) : (
              "Copy link for Instagram"
            )}
          </button>

          {/* Divider */}
          <div className="my-1 border-t border-terracotta-100" />

          {/* Copy link */}
          <button
            type="button"
            data-ocid="post.share.copy_button"
            onClick={() => handleCopy("copy")}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg border text-sm font-body font-medium transition-colors text-terracotta-700 bg-terracotta-50 hover:bg-terracotta-100 border-terracotta-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-green-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Link className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function PostCard({ post, session }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [imgError, setImgError] = useState(false);

  const likeMutation = useLikePost();
  const deleteMutation = useDeletePost();

  const isAuthor = session && session.userId === post.authorId;
  const bodyText = post.body;
  const isLong = bodyText.length > 200;
  const displayBody =
    expanded || !isLong ? bodyText : `${bodyText.slice(0, 200)}…`;

  const handleLike = () => {
    likeMutation.mutate(post.postId);
  };

  const handleDeleteConfirm = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion.");
      return;
    }
    try {
      const result = await deleteMutation.mutateAsync({
        postId: post.postId,
        requesterId: session!.userId,
        password: deletePassword,
      });
      if (!result.ok) {
        setDeleteError(result.message || "Failed to delete post.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Invalid credentials")) {
        setDeleteError("Incorrect password.");
      } else {
        setDeleteError("Failed to delete post. Please try again.");
      }
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-terracotta-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Post Image */}
      {post.imageUrl && !imgError && (
        <div className="relative h-52 overflow-hidden bg-terracotta-50">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      {post.imageUrl && imgError && (
        <div className="h-20 bg-terracotta-50 flex items-center justify-center gap-2 text-terracotta-300">
          <ImageOff className="w-5 h-5" />
          <span className="font-body text-sm">Image unavailable</span>
        </div>
      )}

      <div className="p-5">
        {/* Author & Meta */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-saffron-100 border border-saffron-200 flex items-center justify-center shrink-0">
              <span className="font-display font-bold text-saffron-700 text-sm">
                {post.authorDisplayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-body font-semibold text-terracotta-800 text-sm leading-tight">
                {post.authorDisplayName}
              </p>
              <div className="flex items-center gap-1 text-terracotta-700 text-xs font-medium">
                <Clock className="w-3 h-3" />
                <span className="font-body">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
          {post.destination && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs font-body border-saffron-300 text-saffron-700 bg-saffron-50 shrink-0"
            >
              <MapPin className="w-3 h-3" />
              {post.destination}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-terracotta-900 mb-2 leading-snug">
          {post.title}
        </h3>

        {/* Body */}
        <p className="font-body text-terracotta-700 text-sm leading-relaxed whitespace-pre-line">
          {displayBody}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-saffron-600 hover:text-saffron-500 font-body text-xs font-medium transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Read more
              </>
            )}
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-terracotta-50">
          <button
            type="button"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className="flex items-center gap-1.5 text-terracotta-600 hover:text-red-500 transition-colors group disabled:opacity-60"
          >
            <Heart className="w-4 h-4 group-hover:fill-red-500 transition-all" />
            <span className="font-body text-sm font-medium">
              {post.likes.toString()}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <ShareButton post={post} />

            {isAuthor && (
              <button
                type="button"
                onClick={() => {
                  setShowDeletePrompt(!showDeletePrompt);
                  setDeleteError("");
                  setDeletePassword("");
                }}
                className="flex items-center gap-1.5 text-terracotta-600 hover:text-red-500 transition-colors text-xs font-body"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeletePrompt && isAuthor && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-body text-sm text-red-700 mb-2 font-medium">
              Confirm deletion — enter your password:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-red-200 rounded-lg font-body focus:outline-none focus:border-red-400 bg-white"
              />
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-body font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center gap-1"
              >
                {deleteMutation.isPending ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeletePrompt(false);
                  setDeleteError("");
                  setDeletePassword("");
                }}
                className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-sm font-body rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            {deleteError && (
              <p className="mt-2 text-xs text-red-600 font-body">
                {deleteError}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function CommunityFeed({ session, onLoginRequest }: Props) {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { data: posts, isLoading, isError } = useCommunityPosts();

  return (
    <div className="space-y-6">
      {/* Share Story CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-terracotta-800">
            Travel Stories
          </h2>
          <p className="font-body text-terracotta-600 text-sm mt-0.5">
            {posts ? `${posts.length} stories shared` : "Loading stories..."}
          </p>
        </div>
        {session ? (
          <button
            type="button"
            onClick={() => setCreatePostOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body text-sm rounded-full transition-colors shadow-sm"
          >
            <PenSquare className="w-4 h-4" />
            Share Your Story
          </button>
        ) : (
          <button
            type="button"
            onClick={onLoginRequest}
            className="flex items-center gap-2 px-5 py-2.5 bg-terracotta-100 hover:bg-terracotta-200 text-terracotta-700 font-semibold font-body text-sm rounded-full transition-colors border border-terracotta-200"
          >
            <PenSquare className="w-4 h-4" />
            Login to Share
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-terracotta-100 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-12 text-terracotta-800 font-body">
          Failed to load posts. Please try again later.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && (!posts || posts.length === 0) && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-saffron-50 flex items-center justify-center mx-auto mb-4">
            <PenSquare className="w-8 h-8 text-saffron-400" />
          </div>
          <h3 className="font-display text-xl font-bold text-terracotta-700 mb-2">
            No stories yet
          </h3>
          <p className="font-body text-terracotta-600 text-sm">
            Be the first to share your travel adventure!
          </p>
        </div>
      )}

      {/* Posts */}
      {!isLoading && posts && posts.length > 0 && (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard
              key={post.postId.toString()}
              post={post}
              session={session}
            />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {session && (
        <CreatePostModal
          open={createPostOpen}
          onClose={() => setCreatePostOpen(false)}
          session={session}
        />
      )}
    </div>
  );
}
