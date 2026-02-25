import { Link } from '@tanstack/react-router';
import { ArrowRight, Star, Users, MapPin, Award } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import DestinationCard from '@/components/DestinationCard';
import { featuredDestinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';

const stats = [
    { icon: MapPin, value: '20+', label: 'Destinations' },
    { icon: Users, value: '10K+', label: 'Happy Travelers' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Award, value: '5+', label: 'Years of Excellence' },
];

const whyChooseUs = [
    {
        emoji: '🗺️',
        title: 'Expert Local Guides',
        description: 'Our handpicked local guides bring destinations to life with authentic stories and hidden gems.',
    },
    {
        emoji: '✈️',
        title: 'Curated Itineraries',
        description: 'Every journey is thoughtfully crafted to balance iconic landmarks with off-the-beaten-path experiences.',
    },
    {
        emoji: '🏨',
        title: 'Handpicked Stays',
        description: 'From heritage havelis to eco-lodges, we select accommodations that enhance your travel story.',
    },
    {
        emoji: '🤝',
        title: '24/7 Support',
        description: 'Our dedicated team is always available to ensure your journey is seamless and memorable.',
    },
];

export default function Home() {
    return (
        <main>
            {/* Hero Section */}
            <HeroSection
                backgroundImage="/assets/generated/hero-himalaya.dim_1920x1080.png"
                headline="Discover the Soul of Incredible India"
                subheadline="From the snow-kissed Himalayas to the sun-drenched shores of the Andamans — every journey with SafarX.in is a story waiting to be told."
                ctaLabel="Explore Destinations"
                ctaHref="/destinations"
                secondaryCtaLabel="Plan Your Trip"
                secondaryCtaHref="/contact"
            />

            {/* Stats Bar */}
            <section className="bg-terracotta-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div key={label} className="flex flex-col items-center text-center">
                                <Icon className="w-5 h-5 text-saffron-400 mb-1" />
                                <span className="font-display font-bold text-2xl text-ivory-100">{value}</span>
                                <span className="font-body text-xs text-ivory-300 uppercase tracking-wider">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block font-body text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                            Handpicked for You
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
                            Featured Destinations
                        </h2>
                        <div className="section-divider w-24 mx-auto mb-4" />
                        <p className="font-body text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
                            From ancient temples to pristine beaches, explore India's most captivating destinations curated by our travel experts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredDestinations.slice(0, 8).map((dest) => (
                            <DestinationCard key={dest.id} destination={dest} featured />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/destinations">
                            <Button
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold rounded-full px-8 gap-2"
                            >
                                View All Destinations
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Full-bleed India Map / Promo Section */}
            <section
                className="relative py-28 overflow-hidden"
                style={{
                    backgroundImage: `url(/assets/generated/dest-rajasthan.dim_800x600.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-terracotta-900/80" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-4">
                        Your Journey Awaits
                    </span>
                    <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ivory-100 mb-6 leading-tight">
                        Every Corner of India Has a Story to Tell
                    </h2>
                    <p className="font-cormorant italic text-xl text-ivory-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                        "The world is a book, and those who do not travel read only one page." — Let SafarX.in help you read every chapter of India's magnificent story.
                    </p>
                    <Link to="/contact" search={{}}>
                        <Button
                            size="lg"
                            className="gradient-saffron text-terracotta-900 font-body font-bold rounded-full px-10 py-6 border-0 hover:scale-105 transition-transform"
                        >
                            Start Planning Today
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Why Choose SafarX */}
            <section className="py-20 bg-ivory-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block font-body text-xs font-semibold text-primary uppercase tracking-widest mb-3">
                            Why SafarX.in
                        </span>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
                            Travel with Confidence
                        </h2>
                        <div className="section-divider w-24 mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUs.map((item) => (
                            <div
                                key={item.title}
                                className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-shadow"
                            >
                                <div className="text-4xl mb-4">{item.emoji}</div>
                                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                                    {item.title}
                                </h3>
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 gradient-teal">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-display font-bold text-3xl sm:text-4xl text-ivory-100 mb-4">
                        Ready to Explore India?
                    </h2>
                    <p className="font-body text-ivory-200 mb-8 text-base max-w-xl mx-auto">
                        Send us your travel wishlist and our experts will craft the perfect itinerary just for you.
                    </p>
                    <Link to="/contact" search={{}}>
                        <Button
                            size="lg"
                            className="bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold rounded-full px-10 border-0"
                        >
                            Get a Free Consultation
                        </Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
