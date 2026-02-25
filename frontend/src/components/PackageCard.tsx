import { Link } from '@tanstack/react-router';
import { Clock, MapPin, Tag, ArrowRight } from 'lucide-react';
import type { TravelPackage } from '@/data/packages';

interface PackageCardProps {
    pkg: TravelPackage;
}

const categoryColors: Record<string, string> = {
    Adventure: 'bg-terracotta-100 text-terracotta-700',
    Cultural: 'bg-saffron-100 text-saffron-700',
    Relaxation: 'bg-teal-100 text-teal-700',
    Offbeat: 'bg-purple-100 text-purple-700',
    Beach: 'bg-blue-100 text-blue-700',
    Nature: 'bg-green-100 text-green-700',
    Spiritual: 'bg-amber-100 text-amber-700',
};

export default function PackageCard({ pkg }: PackageCardProps) {
    const categoryColor = categoryColors[pkg.category] || 'bg-saffron-100 text-saffron-700';

    return (
        <div className="group bg-card border border-border/50 rounded-2xl overflow-hidden shadow-card card-hover flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Duration Badge */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-bold bg-terracotta-800/90 text-saffron-300 backdrop-blur-sm">
                        <Clock className="w-3 h-3" />
                        {pkg.duration}
                    </span>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-body font-semibold ${categoryColor}`}>
                        {pkg.category}
                    </span>
                </div>
                {/* Price on image bottom */}
                <div className="absolute bottom-3 left-3">
                    <span className="font-display font-bold text-saffron-300 text-lg drop-shadow-lg">
                        {pkg.priceRange}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
                    {pkg.name}
                </h3>

                {/* Destinations */}
                <div className="flex items-start gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-500 mt-0.5 flex-shrink-0" />
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        {pkg.destinations.join(' · ')}
                    </p>
                </div>

                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {pkg.shortDescription}
                </p>

                {/* Highlights */}
                <div className="mb-5">
                    <p className="font-body text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-teal-600" />
                        Highlights
                    </p>
                    <ul className="space-y-1">
                        {pkg.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="flex items-start gap-1.5 font-body text-xs text-muted-foreground">
                                <span className="text-saffron-500 font-bold mt-0.5 flex-shrink-0">✦</span>
                                {h}
                            </li>
                        ))}
                        {pkg.highlights.length > 3 && (
                            <li className="font-body text-xs text-muted-foreground italic pl-4">
                                +{pkg.highlights.length - 3} more inclusions
                            </li>
                        )}
                    </ul>
                </div>

                {/* CTA */}
                <Link
                    to="/contact"
                    search={{ destination: pkg.name }}
                    className="block"
                >
                    <button className="w-full flex items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold py-2.5 rounded-full transition-all text-sm group-hover:gap-3">
                        Enquire Now
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
