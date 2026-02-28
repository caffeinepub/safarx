import { useState } from 'react';
import { Users, Rss, LogIn } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CommunityFeed from '@/components/CommunityFeed';
import CommunityProfile from '@/components/CommunityProfile';
import CommunityAuthModal from '@/components/CommunityAuthModal';
import { useCommunityUser } from '@/hooks/useQueries';
import useSEO from '@/hooks/useSEO';
import { Button } from '@/components/ui/button';

export default function Community() {
    const { session, login, logout } = useCommunityUser();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useSEO({
        title: 'Community',
        description:
            'Join the SafarX traveler community — share your India travel stories, discover hidden gems, get inspired by fellow explorers, and connect with passionate India enthusiasts worldwide.',
        ogTitle: 'SafarX Community — Share Your India Travel Stories',
        ogDescription:
            'Join thousands of India travel enthusiasts on SafarX Community. Share your travel stories, discover hidden gems, and connect with fellow explorers across incredible India.',
        ogImage: '/assets/generated/community-hero.dim_1200x400.png',
        ogUrl: 'https://safarx.in/community',
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: 'SafarX Community — Share Your India Travel Stories',
        twitterDescription:
            'Join thousands of India travel enthusiasts on SafarX Community. Share your travel stories, discover hidden gems, and connect with fellow explorers across incredible India.',
        twitterImage: '/assets/generated/community-hero.dim_1200x400.png',
    });

    return (
        <div className="min-h-screen bg-ivory-50">
            {/* Hero */}
            <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                    src="/assets/generated/community-hero.dim_1200x400.png"
                    alt="Community of travelers"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-terracotta-900/60 via-terracotta-900/40 to-terracotta-900/70" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-400/40 flex items-center justify-center">
                            <Users className="w-5 h-5 text-saffron-300" />
                        </div>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory-100 mb-2 drop-shadow-lg">
                        SafarX Community
                    </h1>
                    <p className="font-body text-ivory-200 text-base md:text-lg max-w-xl drop-shadow">
                        Share your travel stories, discover hidden gems, and connect with fellow explorers across India.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Tabs defaultValue="feed" className="w-full">
                    <TabsList className="w-full max-w-xs mx-auto mb-8 bg-terracotta-100 border border-terracotta-200 rounded-full p-1 flex">
                        <TabsTrigger
                            value="feed"
                            className="flex-1 rounded-full font-body text-sm font-medium data-[state=active]:bg-saffron-500 data-[state=active]:text-terracotta-900 data-[state=active]:shadow-sm text-terracotta-700 transition-all"
                        >
                            <Rss className="w-3.5 h-3.5 mr-1.5 inline-block" />
                            Feed
                        </TabsTrigger>
                        <TabsTrigger
                            value="profile"
                            className="flex-1 rounded-full font-body text-sm font-medium data-[state=active]:bg-saffron-500 data-[state=active]:text-terracotta-900 data-[state=active]:shadow-sm text-terracotta-700 transition-all"
                        >
                            <Users className="w-3.5 h-3.5 mr-1.5 inline-block" />
                            My Profile
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="feed">
                        <CommunityFeed
                            session={session}
                            onLoginRequest={() => setAuthModalOpen(true)}
                        />
                    </TabsContent>

                    <TabsContent value="profile">
                        {session ? (
                            <CommunityProfile
                                session={session}
                                onLogout={logout}
                            />
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-terracotta-100 shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-saffron-500" />
                                </div>
                                <h3 className="font-display font-bold text-xl text-terracotta-800 mb-2">
                                    Join the Community
                                </h3>
                                <p className="font-body text-terracotta-500 text-sm mb-6 max-w-xs mx-auto">
                                    Log in or create an account to view your profile and share your travel stories.
                                </p>
                                <Button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-semibold rounded-full px-6 gap-2 border-0"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login / Sign Up
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <CommunityAuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onLoginSuccess={(s) => {
                    login(s);
                    setAuthModalOpen(false);
                }}
            />
        </div>
    );
}
