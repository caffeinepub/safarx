import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, Navigation, Star, CheckCircle2, MapPin } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DestinationDetail() {
    const { id } = useParams({ from: '/public-layout/destinations/$id' });
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
                        <Button className="bg-terracotta-700 hover:bg-terracotta-800 text-ivory-100 font-body">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Destinations
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <div
                className="relative h-[60vh] min-h-[400px] flex items-end"
                style={{
                    backgroundImage: `url(${destination.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-terracotta-950/90 via-terracotta-900/40 to-transparent" />
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-10">
                    <Link
                        to="/destinations"
                        className="inline-flex items-center gap-1.5 text-ivory-200 hover:text-ivory-100 font-body text-sm mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Destinations
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-saffron-500/90 text-white border-0 font-body text-xs">
                            {destination.region}
                        </Badge>
                        <Badge variant="outline" className="border-ivory-300/50 text-ivory-200 font-body text-xs">
                            {destination.state}
                        </Badge>
                    </div>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-ivory-100 text-shadow-hero">
                        {destination.name}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Short Description */}
                        <div>
                            <p className="font-cormorant italic text-2xl text-terracotta-700 leading-relaxed mb-4">
                                {destination.shortDescription}
                            </p>
                            <p className="font-body text-muted-foreground leading-relaxed">
                                {destination.fullDescription}
                            </p>
                        </div>

                        {/* Highlights */}
                        {destination.highlights && destination.highlights.length > 0 && (
                            <div>
                                <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-saffron-500" />
                                    Highlights
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {destination.highlights.map((highlight, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                                            <span className="font-body text-sm text-foreground">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Travel Info */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-display font-bold text-base text-foreground mb-4">
                                Travel Info
                            </h3>
                            <div className="space-y-4">
                                {destination.bestTimeToVisit && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-saffron-700" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                Best Time to Visit
                                            </p>
                                            <p className="font-body text-sm font-medium text-foreground">
                                                {destination.bestTimeToVisit}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {destination.howToReach && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                                            <Navigation className="w-4 h-4 text-teal-700" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                How to Reach
                                            </p>
                                            <p className="font-body text-sm font-medium text-foreground">
                                                {destination.howToReach}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {destination.state && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-terracotta-100 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-terracotta-700" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                State / Region
                                            </p>
                                            <p className="font-body text-sm font-medium text-foreground">
                                                {destination.state}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="bg-terracotta-700 rounded-2xl p-6 text-center">
                            <h3 className="font-display font-bold text-lg text-ivory-100 mb-2">
                                Ready to Explore?
                            </h3>
                            <p className="font-body text-sm text-ivory-200 mb-4">
                                Let our experts craft the perfect itinerary for {destination.name}.
                            </p>
                            <Link to="/contact" search={{ destination: destination.name }}>
                                <Button className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-body font-semibold">
                                    Plan This Trip
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
