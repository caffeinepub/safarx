import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, Navigation, Star, CheckCircle2, MapPin } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DestinationDetail() {
    const { id } = useParams({ from: '/destinations/$id' });
    const destination = destinations.find((d) => d.id === id);

    if (!destination) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h1 className="font-display font-bold text-2xl text-foreground mb-2">
                        Destination Not Found
                    </h1>
                    <p className="font-body text-muted-foreground mb-6">
                        The destination you're looking for doesn't exist.
                    </p>
                    <Link to="/destinations">
                        <Button className="bg-primary text-primary-foreground rounded-full font-body">
                            Back to Destinations
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Image */}
            <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Back Button */}
                <div className="absolute top-24 left-4 sm:left-8">
                    <Link to="/destinations">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 backdrop-blur-sm border-white/30 text-ivory-100 hover:bg-white/20 font-body gap-2 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Destinations
                        </Button>
                    </Link>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            {destination.tag && (
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold bg-saffron-500 text-terracotta-900">
                                    {destination.tag}
                                </span>
                            )}
                            <Badge variant="outline" className="border-white/40 text-ivory-200 font-body text-xs">
                                {destination.region} India
                            </Badge>
                        </div>
                        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-ivory-100 text-shadow-hero mb-2">
                            {destination.name}
                        </h1>
                        <div className="flex items-center gap-1.5 text-ivory-200">
                            <MapPin className="w-4 h-4 text-saffron-400" />
                            <span className="font-body text-sm">{destination.state}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                                About {destination.name}
                            </h2>
                            <p className="font-body text-base text-foreground/80 leading-relaxed">
                                {destination.fullDescription}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div>
                            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                                Top Highlights
                            </h2>
                            <ul className="space-y-3">
                                {destination.highlights.map((highlight) => (
                                    <li key={highlight} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-saffron-500 mt-0.5 flex-shrink-0" />
                                        <span className="font-body text-base text-foreground/80">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Best Time */}
                        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-saffron-600" />
                                </div>
                                <h3 className="font-display font-semibold text-base text-foreground">
                                    Best Time to Visit
                                </h3>
                            </div>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                {destination.bestTimeToVisit}
                            </p>
                        </div>

                        {/* How to Reach */}
                        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                    <Navigation className="w-4 h-4 text-teal-600" />
                                </div>
                                <h3 className="font-display font-semibold text-base text-foreground">
                                    How to Reach
                                </h3>
                            </div>
                            <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                {destination.howToReach}
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-saffron-100 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-saffron-600 fill-saffron-500" />
                                </div>
                                <h3 className="font-display font-semibold text-base text-foreground">
                                    Traveler Rating
                                </h3>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className="w-5 h-5 text-saffron-500 fill-saffron-400" />
                                ))}
                                <span className="font-body text-sm text-muted-foreground ml-2">4.9 / 5</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-terracotta-800 rounded-2xl p-5 text-center">
                            <h3 className="font-display font-bold text-lg text-ivory-100 mb-2">
                                Plan a Trip to {destination.name}
                            </h3>
                            <p className="font-body text-xs text-ivory-300 mb-4">
                                Get a personalized itinerary from our travel experts.
                            </p>
                            <Link to="/contact" search={{ destination: destination.name }}>
                                <Button className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold rounded-full border-0">
                                    Inquire Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
