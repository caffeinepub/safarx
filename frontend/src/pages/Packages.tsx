import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Package, Filter } from 'lucide-react';
import { travelPackages } from '@/data/packages';
import PackageCard from '@/components/PackageCard';
import { Button } from '@/components/ui/button';
import useSEO from '@/hooks/useSEO';
import { getBreadcrumbSchema } from '@/utils/structuredData';

const categories = ['All', 'Adventure', 'Cultural', 'Relaxation', 'Offbeat', 'Beach', 'Nature', 'Spiritual'];

export default function Packages() {
    const [activeCategory, setActiveCategory] = useState('All');

    useSEO({
        title: 'Travel Packages',
        description:
            'Explore handpicked India travel packages by SafarX — Himalayan adventures, Rajasthan heritage tours, Kerala backwater cruises, beach getaways, and cultural expeditions with detailed itineraries.',
        ogTitle: 'Curated India Travel Packages — SafarX',
        ogDescription:
            'Discover handpicked India travel packages — Himalayan adventures, Rajasthan heritage tours, Kerala backwater cruises, beach getaways, and cultural expeditions crafted by SafarX experts.',
        ogImage: '/assets/generated/packages-hero-banner.dim_1400x500.png',
        ogUrl: 'https://safarx.in/packages',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Curated India Travel Packages — SafarX',
        twitterDescription:
            'Discover handpicked India travel packages — Himalayan adventures, Rajasthan heritage tours, Kerala backwater cruises, beach getaways, and cultural expeditions crafted by SafarX experts.',
        twitterImage: '/assets/generated/packages-hero-banner.dim_1400x500.png',
    });

    // Inject BreadcrumbList JSON-LD structured data
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(
            getBreadcrumbSchema([
                { name: 'Home', url: 'https://safarx.in' },
                { name: 'Travel Packages', url: 'https://safarx.in/packages' },
            ])
        );
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const filtered = activeCategory === 'All'
        ? travelPackages
        : travelPackages.filter((p) => p.category === activeCategory);

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <div
                className="relative pt-32 pb-20 overflow-hidden"
                style={{
                    backgroundImage: `url(/assets/generated/packages-hero-banner.dim_1400x500.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-terracotta-900/80" />
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-flex items-center gap-2 font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-3">
                        <Package className="w-3.5 h-3.5" />
                        Handcrafted Journeys
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-ivory-100 mb-4 text-shadow-hero">
                        Curated Travel Packages
                    </h1>
                    <p className="font-cormorant italic text-xl text-ivory-200 max-w-xl mx-auto">
                        Thoughtfully crafted journeys across India — from Himalayan peaks to tropical shores, every package is a story waiting to unfold.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-border py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
                        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full font-body text-sm font-medium transition-all ${
                                    activeCategory === cat
                                        ? 'bg-saffron-500 text-terracotta-900 shadow-sm'
                                        : 'bg-muted text-muted-foreground hover:bg-saffron-100 hover:text-saffron-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                                {activeCategory === 'All' ? 'All Packages' : `${activeCategory} Packages`}
                            </h2>
                            <p className="font-body text-sm text-muted-foreground mt-1">
                                {filtered.length} package{filtered.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-5xl mb-4">🗺️</div>
                            <p className="font-body text-muted-foreground">No packages found for this category.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((pkg) => (
                                <PackageCard key={pkg.id} pkg={pkg} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-terracotta-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-ivory-100">
                    <div className="text-4xl mb-4">✈️</div>
                    <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                        Can't Find Your Perfect Package?
                    </h2>
                    <p className="font-body text-ivory-300 mb-8 max-w-xl mx-auto">
                        We specialise in crafting fully customised itineraries. Tell us your dream trip and we'll make it happen.
                    </p>
                    <Link to="/plan">
                        <Button className="bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold rounded-full px-8 border-0 mr-4">
                            Plan Custom Trip
                        </Button>
                    </Link>
                    <Link to="/contact" search={{}}>
                        <Button variant="outline" className="border-ivory-300 text-ivory-100 hover:bg-white/10 font-body font-semibold rounded-full px-8">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
