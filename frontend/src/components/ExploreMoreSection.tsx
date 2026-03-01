import { useQuery } from '@tanstack/react-query';
import { Sparkles, MapPin, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { fetchExploreMore } from '@/utils/geminiClient';
import type { TravelStyle, GroupType } from '@/utils/itineraryGenerator';

interface ExploreMoreSectionProps {
    destination: string;
    duration: number;
    travelStyle: TravelStyle;
    groupType: GroupType;
}

export default function ExploreMoreSection({
    destination,
    duration,
    travelStyle,
    groupType,
}: ExploreMoreSectionProps) {
    const queryKey = ['exploreMore', destination, duration, travelStyle, groupType];

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey,
        queryFn: () => fetchExploreMore({ destination, duration, travelStyle, groupType }),
        retry: 1,
        staleTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
    });

    return (
        <div className="bg-gradient-to-br from-teal-900 to-teal-800 rounded-2xl overflow-hidden shadow-card">
            {/* Section Header */}
            <div className="px-6 pt-6 pb-4 border-b border-teal-700/50">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-500/30 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-saffron-400" />
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-xl text-ivory-100">
                                Explore More
                            </h3>
                            <p className="font-body text-xs text-teal-300">
                                AI-powered suggestions for your {destination} trip
                            </p>
                        </div>
                    </div>
                    {!isLoading && (
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-700/50 hover:bg-teal-700 border border-teal-600/50 text-teal-200 text-xs font-body font-semibold transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-4 border-teal-700 border-t-saffron-400 animate-spin" />
                            <Sparkles className="w-5 h-5 text-saffron-400 absolute inset-0 m-auto" />
                        </div>
                        <div className="text-center">
                            <p className="font-body text-sm font-semibold text-ivory-200 mb-1">
                                Discovering hidden gems…
                            </p>
                            <p className="font-body text-xs text-teal-400">
                                Our AI is crafting personalised suggestions for you
                            </p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center py-8 gap-4">
                        <div className="w-12 h-12 rounded-full bg-terracotta-800/50 border border-terracotta-600/40 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-terracotta-400" />
                        </div>
                        <div className="text-center max-w-sm">
                            <p className="font-body text-sm font-semibold text-ivory-200 mb-1">
                                Couldn't load suggestions
                            </p>
                            <p className="font-body text-xs text-teal-400 mb-4">
                                {error instanceof Error && error.message.includes('API key')
                                    ? 'Gemini API key is not configured. Add VITE_GEMINI_API_KEY to your .env file.'
                                    : 'Something went wrong while fetching AI suggestions. Your itinerary is unaffected.'}
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-500/20 hover:bg-saffron-500/30 border border-saffron-500/30 text-saffron-300 text-xs font-body font-semibold transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {data && !isLoading && (
                    <div className="space-y-5">
                        {/* Intro */}
                        <p className="font-cormorant italic text-lg text-ivory-200 leading-relaxed border-l-2 border-saffron-500/50 pl-4">
                            {data.intro}
                        </p>

                        {/* Suggestion Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.suggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className="bg-teal-700/30 border border-teal-600/30 rounded-xl p-4 hover:bg-teal-700/50 transition-colors"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-saffron-500/15 border border-saffron-500/20 flex items-center justify-center flex-shrink-0 text-xl">
                                            {suggestion.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron-500/15 border border-saffron-500/20 text-saffron-300 text-xs font-body font-semibold">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {suggestion.category}
                                                </span>
                                            </div>
                                            <h4 className="font-display font-bold text-sm text-ivory-100 mb-1 leading-tight">
                                                {suggestion.title}
                                            </h4>
                                            <p className="font-body text-xs text-teal-300 leading-relaxed">
                                                {suggestion.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Local Insider Tip */}
                        <div className="bg-saffron-500/10 border border-saffron-500/20 rounded-xl p-4 flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Lightbulb className="w-4 h-4 text-saffron-400" />
                            </div>
                            <div>
                                <p className="font-body text-xs font-bold text-saffron-300 uppercase tracking-wider mb-1">
                                    Insider Tip
                                </p>
                                <p className="font-body text-sm text-ivory-200 leading-relaxed">
                                    {data.localTip}
                                </p>
                            </div>
                        </div>

                        <p className="font-body text-xs text-teal-500 text-right">
                            ✨ Powered by Google Gemini AI
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
