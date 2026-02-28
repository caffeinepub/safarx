import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, Navigation, CheckCircle2, MapPin } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useSEO from '@/hooks/useSEO';

function DestinationDetailContent({ id }: { id: string }) {
    const destination = destinations.find((d) => d.id === id);

    useSEO(
        destination
            ? {
                  title: `${destination.name}, ${destination.state}`,
                  description: `Explore ${destination.name} in ${destination.state} with SafarX. Best time to visit: ${destination.bestTimeToVisit ?? 'year-round'}. ${destination.shortDescription}`,
                  ogTitle: `${destination.name}, ${destination.state} — SafarX`,
                  ogDescription: `${destination.shortDescription} Explore ${destination.name} with SafarX — best time to visit: ${destination.bestTimeToVisit ?? 'year-round'}.`,
                  ogImage: destination.image,
                  ogUrl: `https://safarx.in/destinations/${destination.id}`,
                  ogType: 'article',
                  twitterCard: 'summary_large_image',
                  twitterTitle: `${destination.name}, ${destination.state} — SafarX`,
                  twitterDescription: `${destination.shortDescription} Explore ${destination.name} with SafarX — best time to visit: ${destination.bestTimeToVisit ?? 'year-round'}.`,
                  twitterImage: destination.image,
              }
            : {
                  title: 'Destination Not Found',
                  description: 'The destination you are looking for could not be found. Browse all Indian destinations on SafarX and plan your perfect trip.',
              }
    );

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
                <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/90 via-terracotta-900/40 to-transparent" />
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                    <Link
                        to="/destinations"
                        className="inline-flex items-center gap-1.5 font-body text-sm text-ivory-300 hover:text-ivory-100 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Destinations
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-saffron-500/90 text-terracotta-900 font-body text-xs font-semibold border-0">
                            {destination.region} India
                        </Badge>
                        <Badge variant="outline" className="border-ivory-300/50 text-ivory-200 font-body text-xs">
                            {destination.state}
                        </Badge>
                        {destination.tag && (
                            <Badge variant="outline" className="border-saffron-400/50 text-saffron-200 font-body text-xs">
                                {destination.tag}
                            </Badge>
                        )}
                    </div>
                    <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-ivory-100 text-shadow-hero">
                        {destination.name}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="font-display font-bold text-2xl text-foreground mb-4">
                                About {destination.name}
                            </h2>
                            <p className="font-body text-muted-foreground leading-relaxed text-base">
                                {destination.fullDescription}
                            </p>
                        </div>

                        {/* Highlights */}
                        {destination.highlights && destination.highlights.length > 0 && (
                            <div>
                                <h3 className="font-display font-semibold text-xl text-foreground mb-4">
                                    Highlights
                                </h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {destination.highlights.map((highlight) => (
                                        <li key={highlight} className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                                            <span className="font-body text-sm text-foreground">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-6">
                            <h3 className="font-display font-bold text-xl text-terracotta-800 mb-2">
                                Ready to Visit {destination.name}?
                            </h3>
                            <p className="font-body text-sm text-terracotta-700 mb-4">
                                Let our travel experts craft a personalised itinerary for your perfect trip.
                            </p>
                            <Link to="/contact" search={{ destination: destination.name }}>
                                <Button className="bg-terracotta-700 hover:bg-terracotta-800 text-ivory-100 font-body font-semibold rounded-full">
                                    Enquire Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Travel Info */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-display font-semibold text-lg text-foreground mb-4">
                                Travel Information
                            </h3>
                            <div className="space-y-4">
                                {destination.bestTimeToVisit && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-saffron-100 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-saffron-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                Best Time to Visit
                                            </p>
                                            <p className="font-body text-sm text-foreground font-medium">
                                                {destination.bestTimeToVisit}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {destination.howToReach && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <Navigation className="w-4 h-4 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                How to Reach
                                            </p>
                                            <p className="font-body text-sm text-foreground font-medium">
                                                {destination.howToReach}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4 h-4 text-terracotta-600" />
                                    </div>
                                    <div>
                                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                            State / Region
                                        </p>
                                        <p className="font-body text-sm text-foreground font-medium">
                                            {destination.state}, {destination.region} India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {destination.tags && destination.tags.length > 0 && (
                            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                                <h3 className="font-display font-semibold text-base text-foreground mb-3">
                                    Travel Style
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {destination.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="font-body text-xs bg-saffron-50 text-saffron-700 border border-saffron-200"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function DestinationDetail() {
    const { id } = useParams({ from: '/public-layout/destinations/$id' });
    return <DestinationDetailContent id={id} />;
}
