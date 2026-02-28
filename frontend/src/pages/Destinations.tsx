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
    All: "Discover all of India's incredible destinations across every region.",
    North: 'Majestic Himalayas, royal Rajasthan, and the spiritual Gangetic plains.',
    South: 'Tropical backwaters, ancient temples, pristine beaches, and lush forests.',
    East: 'Cultural capitals, tea gardens, wildlife sanctuaries, and sacred shores.',
    West: 'Desert forts, coastal paradises, and the vibrant city of dreams.',
    Northeast: 'Misty hills, living root bridges, tribal cultures, and wildlife wonders.',
};

export default function Destinations() {
    const [search, setSearch] = useState('');
    const [activeRegion, setActiveRegion] = useState<Region>('All');

    useSEO({
        title: 'Explore Indian Destinations | SafarX Travel Guide',
        description:
            "Browse SafarX's comprehensive guide to Indian destinations. From Rajasthan's heritage cities to Himalayan hill stations, Kerala backwaters to Andaman beaches - find your perfect Indian destination.",
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
            d.shortDescription.toLowerCase().includes(search.toLowerCase());
        return matchesRegion && matchesSearch;
    });

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
                        From the peaks of the Himalayas to the tip of Kanyakumari — discover every facet of incredible India.
                    </p>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        {/* Region Tabs */}
                        <Tabs
                            value={activeRegion}
                            onValueChange={(v) => setActiveRegion(v as Region)}
                            className="w-full sm:w-auto"
                        >
                            <TabsList className="bg-muted h-auto flex-wrap gap-1 p-1">
                                {regions.map((region) => (
                                    <TabsTrigger
                                        key={region}
                                        value={region}
                                        className="font-body text-xs sm:text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3 py-1.5"
                                    >
                                        {region}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>

                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search destinations..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 font-body text-sm bg-card border-border"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Region Description */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                <p className="font-cormorant italic text-lg text-muted-foreground">
                    {regionDescriptions[activeRegion]}
                </p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                    Showing <span className="font-semibold text-foreground">{filtered.length}</span> destination{filtered.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Destinations Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((dest) => (
                            <DestinationCard key={dest.id} destination={dest} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">🗺️</div>
                        <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                            No destinations found
                        </h3>
                        <p className="font-body text-muted-foreground">
                            Try adjusting your search or filter.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
