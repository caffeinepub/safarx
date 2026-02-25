import { Link } from '@tanstack/react-router';
import { Compass, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { SiInstagram, SiFacebook, SiX, SiYoutube } from 'react-icons/si';

const regions = ['North India', 'South India', 'East India', 'West India', 'Northeast India'];
const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Destinations', href: '/destinations' },
    { label: 'Contact Us', href: '/contact' },
];

export default function Footer() {
    const year = new Date().getFullYear();
    const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'safarx-in');

    return (
        <footer className="bg-terracotta-900 text-ivory-200">
            {/* Top divider */}
            <div className="section-divider" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-saffron-500">
                                <Compass className="w-5 h-5 text-terracotta-900" />
                            </div>
                            <span className="font-display font-bold text-2xl text-ivory-100">
                                SafarX<span className="text-saffron-400">.in</span>
                            </span>
                        </Link>
                        <p className="font-body text-sm text-ivory-300 leading-relaxed mb-5">
                            Your trusted companion for exploring the incredible diversity of India — from the Himalayas to the backwaters, deserts to rainforests.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { Icon: SiInstagram, href: 'https://www.instagram.com/SafarX.in' },
                                { Icon: SiFacebook, href: '#' },
                                { Icon: SiX, href: '#' },
                                { Icon: SiYoutube, href: '#' },
                            ].map(({ Icon, href }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-saffron-500 hover:text-terracotta-900 text-ivory-300 transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Regions */}
                    <div>
                        <h4 className="font-display font-semibold text-ivory-100 mb-4 text-base">
                            Explore Regions
                        </h4>
                        <ul className="space-y-2">
                            {regions.map((region) => (
                                <li key={region}>
                                    <Link
                                        to="/destinations"
                                        className="font-body text-sm text-ivory-300 hover:text-saffron-400 transition-colors flex items-center gap-1.5"
                                    >
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        {region}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-display font-semibold text-ivory-100 mb-4 text-base">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        to={link.href}
                                        className="font-body text-sm text-ivory-300 hover:text-saffron-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-display font-semibold text-ivory-100 mb-4 text-base">
                            Get In Touch
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5">
                                <Mail className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="mailto:travelsafarx@gmail.com"
                                    className="font-body text-sm text-ivory-300 hover:text-saffron-400 transition-colors"
                                >
                                    travelsafarx@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <Phone className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="tel:+918979695644"
                                    className="font-body text-sm text-ivory-300 hover:text-saffron-400 transition-colors"
                                >
                                    +91 8979695644
                                </a>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <SiInstagram className="w-4 h-4 text-saffron-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://www.instagram.com/SafarX.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-body text-sm text-ivory-300 hover:text-saffron-400 transition-colors"
                                >
                                    @SafarX.in
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="font-body text-xs text-ivory-400">
                        © {year} SafarX.in — All rights reserved.
                    </p>
                    <p className="font-body text-xs text-ivory-400 flex items-center gap-1">
                        Built with{' '}
                        <Heart className="w-3 h-3 text-saffron-400 fill-saffron-400" />{' '}
                        using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saffron-400 hover:text-saffron-300 transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
