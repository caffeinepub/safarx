import { Link } from '@tanstack/react-router';
import { MapPin, ArrowRight, Mountain, Gem } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/data/destinations';

interface DestinationCardProps {
    destination: Destination;
    featured?: boolean;
}

export default function DestinationCard({ destination, featured = false }: DestinationCardProps) {
    const isGenZ = destination.tags?.includes('Gen-Z Favourite');
    const isHillStation = destination.tags?.includes('Hill Station');
    const isHiddenGem = destination.tags?.includes('Hidden Gem');
    // Use the first tag as the primary display tag
    const primaryTag = destination.tag ?? destination.tags?.[0];

    return (
        <Link
            to="/destinations/$id"
            params={{ id: destination.id }}
            className={`group block rounded-2xl overflow-hidden bg-card shadow-card card-hover border border-border/50 ${
                featured ? 'h-full' : ''
            }`}
        >
            {/* Image */}
            <div className={`relative overflow-hidden ${featured ? 'h-52' : 'h-48'}`}>
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Primary tag badge (top-left) */}
                {primaryTag && (
                    <div className="absolute top-3 left-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-semibold ${
                            isHiddenGem
                                ? 'bg-teal-500 text-white'
                                : 'bg-saffron-500 text-terracotta-900'
                        }`}>
                            {primaryTag}
                        </span>
                    </div>
                )}

                {/* Special badges (top-right) */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {isHiddenGem && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-bold bg-teal-500/90 text-white backdrop-blur-sm shadow-sm">
                            <Gem className="w-3 h-3" />
                            Hidden Gem
                        </span>
                    )}
                    {isGenZ && !isHiddenGem && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-bold bg-teal-500/90 text-white backdrop-blur-sm shadow-sm">
                            ✨ Gen-Z
                        </span>
                    )}
                    {isHillStation && !isGenZ && !isHiddenGem && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-bold bg-terracotta-600/90 text-white backdrop-blur-sm shadow-sm">
                            <Mountain className="w-3 h-3" />
                            Hill
                        </span>
                    )}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-ivory-100">
                    <MapPin className="w-3 h-3 text-saffron-400" />
                    <span className="text-xs font-body font-medium text-shadow-sm">{destination.state}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-semibold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                        {destination.name}
                    </h3>
                    <Badge
                        variant="outline"
                        className="text-xs font-body shrink-0 border-border text-muted-foreground"
                    >
                        {destination.region}
                    </Badge>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {destination.shortDescription}
                </p>
                <div className="flex items-center gap-1 text-primary font-body text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}
