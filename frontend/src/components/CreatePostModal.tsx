import { useState } from 'react';
import { X, PenSquare, MapPin, Image, AlignLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCreatePost, type CommunitySession } from '@/hooks/useQueries';

interface Props {
    open: boolean;
    onClose: () => void;
    session: CommunitySession;
}

export default function CreatePostModal({ open, onClose, session }: Props) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [destination, setDestination] = useState('');
    const [errors, setErrors] = useState<{ title?: string; body?: string }>({});
    const [successMsg, setSuccessMsg] = useState('');

    const createPost = useCreatePost();

    const resetForm = () => {
        setTitle('');
        setBody('');
        setImageUrl('');
        setDestination('');
        setErrors({});
        setSuccessMsg('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const validate = () => {
        const newErrors: { title?: string; body?: string } = {};
        if (!title.trim()) newErrors.title = 'Title is required.';
        if (!body.trim()) newErrors.body = 'Story content is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        if (!validate()) return;

        // Use the session password; Google users use the sentinel value
        const password = session.isGoogleUser ? 'GOOGLE_AUTH' : (session.password ?? '');

        try {
            const result = await createPost.mutateAsync({
                authorId: session.userId,
                password,
                title: title.trim(),
                body: body.trim(),
                imageUrl: imageUrl.trim(),
                destination: destination.trim(),
            });
            if (result.ok) {
                setSuccessMsg('Your story has been shared!');
                setTimeout(() => {
                    handleClose();
                }, 1200);
            } else {
                setErrors({ title: 'Failed to create post. Please try again.' });
            }
        } catch {
            setErrors({ title: 'Something went wrong. Please try again.' });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-lg bg-ivory-50 border-terracotta-200 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sr-only">
                    <DialogTitle>Share Your Travel Story</DialogTitle>
                    <DialogDescription>Create a new travel post to share with the community</DialogDescription>
                </DialogHeader>

                {/* Header — sticky only (no conflicting relative) */}
                <div className="bg-terracotta-800 px-6 py-5 sticky top-0 z-10">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-ivory-300 hover:text-ivory-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center">
                            <PenSquare className="w-4 h-4 text-saffron-300" />
                        </div>
                        <div>
                            <h2 className="font-display text-xl font-bold text-ivory-100">Share Your Story</h2>
                            <p className="font-body text-ivory-300 text-xs">
                                Posting as <span className="text-saffron-300 font-medium">{session.displayName}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <Label htmlFor="post-title" className="font-body text-terracotta-700 text-sm font-medium">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="post-title"
                            type="text"
                            placeholder="Give your story a catchy title..."
                            value={title}
                            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
                            className="border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-600 font-body">{errors.title}</p>
                        )}
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5">
                        <Label htmlFor="post-body" className="font-body text-terracotta-700 text-sm font-medium flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5" />
                            Your Story <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="post-body"
                            placeholder="Tell us about your travel experience, tips, hidden gems..."
                            value={body}
                            onChange={(e) => { setBody(e.target.value); setErrors((p) => ({ ...p, body: undefined })); }}
                            className="border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body min-h-[140px] resize-none"
                        />
                        {errors.body && (
                            <p className="text-xs text-red-600 font-body">{errors.body}</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1.5">
                        <Label htmlFor="post-image" className="font-body text-terracotta-700 text-sm font-medium flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            Image URL <span className="text-terracotta-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="post-image"
                            type="url"
                            placeholder="https://example.com/your-travel-photo.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                        />
                    </div>

                    {/* Destination */}
                    <div className="space-y-1.5">
                        <Label htmlFor="post-destination" className="font-body text-terracotta-700 text-sm font-medium flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Destination Tag <span className="text-terracotta-400 font-normal text-xs">(optional)</span>
                        </Label>
                        <Input
                            id="post-destination"
                            type="text"
                            placeholder="e.g. Rajasthan, Kerala, Ladakh..."
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                        />
                    </div>

                    {/* Success */}
                    {successMsg && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700 font-body flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {successMsg}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 border-terracotta-200 text-terracotta-600 hover:bg-terracotta-50 font-body rounded-full"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createPost.isPending}
                            className="flex-1 bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body rounded-full"
                        >
                            {createPost.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-terracotta-900/30 border-t-terracotta-900 rounded-full animate-spin" />
                                    Publishing...
                                </span>
                            ) : (
                                'Publish Story'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
