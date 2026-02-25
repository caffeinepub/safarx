import { Link } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
    backgroundImage: string;
    headline: string;
    subheadline: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    minHeight?: string;
}

export default function HeroSection({
    backgroundImage,
    headline,
    subheadline,
    ctaLabel,
    ctaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    minHeight = 'min-h-screen',
}: HeroSectionProps) {
    const scrollDown = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    return (
        <section
            className={`relative ${minHeight} flex items-center justify-center overflow-hidden`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 hero-overlay" />

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10 pattern-dots" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/20 border border-saffron-400/40 mb-6 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                    <span className="font-body text-xs font-semibold text-saffron-300 tracking-widest uppercase">
                        SafarX.in — Explore Incredible India
                    </span>
                </div>

                <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory-100 leading-tight mb-6 text-shadow-hero">
                    {headline}
                </h1>

                <p className="font-cormorant text-xl sm:text-2xl text-ivory-200 max-w-2xl mx-auto mb-10 leading-relaxed text-shadow-sm italic">
                    {subheadline}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to={ctaHref}>
                        <Button
                            size="lg"
                            className="gradient-saffron text-terracotta-900 font-body font-bold text-base px-8 py-6 rounded-full border-0 shadow-hero hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            {ctaLabel}
                        </Button>
                    </Link>
                    {secondaryCtaLabel && secondaryCtaHref && (
                        <Link to={secondaryCtaHref}>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 backdrop-blur-sm border-white/40 text-ivory-100 hover:bg-white/20 font-body font-semibold text-base px-8 py-6 rounded-full transition-all duration-300"
                            >
                                {secondaryCtaLabel}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Scroll indicator */}
            <button
                onClick={scrollDown}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ivory-200 hover:text-saffron-400 transition-colors animate-bounce"
                aria-label="Scroll down"
            >
                <ChevronDown className="w-8 h-8" />
            </button>
        </section>
    );
}
