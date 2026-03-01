import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import { destinations, type Region } from '@/data/destinations';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import useSEO from '@/hooks/useSEO';
import { getBreadcrumbSchema } from '@/utils/structuredData';

const regions: Region[] = ['All', 'North', 'South', 'East', 'West', 'Northeast'];

const regionDescriptions: Record<Region, string> = {
    All: "Discover all of India's incredible destinations across every region — including hidden gems and offbeat trails.",
    North: 'Majestic Himalayas, royal Rajasthan, spiritual Gangetic plains, and hidden Himalayan valleys.',
    South: 'Tropical backwaters, ancient temples, pristine beaches, lush forests, and secret coastal towns.',
    East: 'Cultural capitals, tea gardens, wildlife sanctuaries, sacred shores, and island paradises.',
    West: 'Desert forts, coastal paradises, the vibrant city of dreams, and geological wonders.',
    Northeast: 'Misty hills, living root bridges, tribal cultures, wildlife wonders, and alpine valleys.',
};

export default function Destinations() {
    const [search, setSearch] = useState('');
    const [activeRegion, setActiveRegion] = useState<Region>('All');

    useSEO({
        title: 'Destinations',
        description:
            "Browse India's most breathtaking destinations with SafarX — from Himalayan peaks and Rajasthan forts to Kerala backwaters, Andaman beaches, and Northeast tribal trails.",
        ogTitle: 'Explore Indian Destinations — SafarX',
        ogDescription:
            "Browse 30+ handpicked destinations across India — Himalayan peaks, Rajasthan forts, Kerala backwaters, Andaman beaches, hidden gems, and Northeast tribal trails, all on SafarX.",
        ogImage: '/assets/generated/hilly-destinations-banner.dim_1400x600.png',
        ogUrl: 'https://safarx.in/destinations',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Explore Indian Destinations — SafarX',
        twitterDescription:
            "Browse 30+ handpicked destinations across India — Himalayan peaks, Rajasthan forts, Kerala backwaters, Andaman beaches, hidden gems, and Northeast tribal trails, all on SafarX.",
        twitterImage: '/assets/generated/hilly-destinations-banner.dim_1400x600.png',
    });

    // Inject BreadcrumbList JSON-LD structured data
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(
            getBreadcrumbSchema([
                { name: 'Home', url: 'https://safarx.in' },
                { name: 'Destinations', url: 'https://safarx.in/destinations' },
            ])
        );
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const filtered = destinations.filter((d) => {
        const matchesRegion = activeRegion === 'All' || d.region === activeRegion;
        const matchesSearch =
            search === '' ||
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.state.toLowerCase().includes(search.toLowerCase()) ||
            d.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
            (d.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchesRegion && matchesSearch;
    });

    // Separate hidden gems for a special section
    const hiddenGems = filtered.filter((d) => d.tags?.includes('Hidden Gem'));
    const regularDestinations = filtered.filter((d) => !d.tags?.includes('Hidden Gem'));

    return (
        <main className="min-h-screen bg-background">
            {/* Page Header */}
            <div
                className="relative pt-32 pb-20 overflow-hidden"
                style={{
                    backgroundImage: `url(/assets/generated/dest-kerala.dim_800x600.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-terracotta-900/75" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-3">
                        Explore India
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-ivory-100 mb-4 text-shadow-hero">
                        All Destinations
                    </h1>
                    <p className="font-cormorant italic text-xl text-ivory-200 max-w-xl mx-auto">
                        From the peaks of the Himalayas to the tip of Kanyakumari — discover every facet of incredible India, including hidden gems off the beaten path.
                    </p>
                </div>
            </div>

            {/* Search & Filter */}
            <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search destinations, states, or tags…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 font-body text-sm bg-background border-border rounded-full h-10"
                        />
                    </div>

                    {/* Region Tabs */}
                    <Tabs value={activeRegion} onValueChange={(v) => setActiveRegion(v as Region)}>
                        <TabsList className="bg-transparent gap-1 h-auto flex-wrap justify-start p-0">
                            {regions.map((region) => (
                                <TabsTrigger
                                    key={region}
                                    value={region}
                                    className="px-4 py-1.5 rounded-full font-body text-sm font-medium data-[state=active]:bg-saffron-500 data-[state=active]:text-terracotta-900 data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground transition-all"
                                >
                                    {region}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {regions.map((region) => (
                            <TabsContent key={region} value={region} className="mt-0" />
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Region Description */}
            <section className="py-6 bg-ivory-50 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="font-cormorant italic text-lg text-muted-foreground text-center">
                        {regionDescriptions[activeRegion]}
                    </p>
                </div>
            </section>

            {/* Destinations Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">🔍</div>
                            <p className="font-body text-muted-foreground">
                                No destinations found. Try a different search or region.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="font-body text-sm text-muted-foreground mb-6">
                                Showing {filtered.length} destination{filtered.length !== 1 ? 's' : ''}
                            </p>

                            {/* Regular Destinations */}
                            {regularDestinations.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                                    {regularDestinations.map((dest) => (
                                        <DestinationCard key={dest.id} destination={dest} />
                                    ))}
                                </div>
                            )}

                            {/* Hidden Gems Section */}
                            {hiddenGems.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-px flex-1 bg-border" />
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
                                            <span className="text-lg">💎</span>
                                            <span className="font-display font-bold text-teal-700 text-sm">
                                                Hidden Gems — Off the Beaten Path
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-border" />
                                    </div>
                                    <p className="font-body text-sm text-muted-foreground text-center mb-6">
                                        Discover India's lesser-known treasures — destinations that reward the curious traveler with authentic experiences and fewer crowds.
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {hiddenGems.map((dest) => (
                                            <DestinationCard key={dest.id} destination={dest} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
