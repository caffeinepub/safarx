import { useState, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, Compass, MapPin, Mail, Home, Wand2, Package, LayoutDashboard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const navLinks = [
    { label: 'Home', href: '/' as const, icon: Home },
    { label: 'Destinations', href: '/destinations' as const, icon: MapPin },
    { label: 'Plan My Trip', href: '/plan' as const, icon: Wand2 },
    { label: 'Packages', href: '/packages' as const, icon: Package },
    { label: 'Community', href: '/community' as const, icon: Users },
    { label: 'Contact', href: '/contact' as const, icon: Mail },
    { label: 'Admin', href: '/admin' as const, icon: LayoutDashboard },
];

export default function HeaderWithAdmin() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || !isHome
                    ? 'bg-terracotta-900/95 backdrop-blur-md shadow-lg'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-saffron-500 group-hover:bg-saffron-400 transition-colors">
                            <Compass className="w-5 h-5 text-terracotta-900" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-display font-bold text-xl text-ivory-100 tracking-tight">
                                SafarX
                                <span className="text-saffron-400">.in</span>
                            </span>
                            <span className="text-[10px] text-ivory-300 font-body tracking-widest uppercase hidden sm:block">
                                Explore Incredible India
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.href;

                            if (link.href === '/plan') {
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-body text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-saffron-400 bg-white/10'
                                                : 'text-saffron-300 hover:text-saffron-200 hover:bg-white/10'
                                        }`}
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        {link.label}
                                    </Link>
                                );
                            }

                            if (link.href === '/community') {
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-body text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-saffron-400 bg-white/10'
                                                : 'text-ivory-200 hover:text-saffron-300 hover:bg-white/10'
                                        }`}
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        {link.label}
                                    </Link>
                                );
                            }

                            if (link.href === '/admin') {
                                return (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-body text-xs font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-saffron-400 bg-white/10'
                                                : 'text-ivory-400 hover:text-ivory-200 hover:bg-white/10'
                                        }`}
                                    >
                                        <LayoutDashboard className="w-3.5 h-3.5" />
                                        Admin
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    className={`px-4 py-2 rounded-md font-body text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'text-saffron-400 bg-white/10'
                                            : 'text-ivory-200 hover:text-saffron-300 hover:bg-white/10'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <Link to="/contact" search={{}}>
                            <Button
                                size="sm"
                                className="ml-3 bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body border-0 rounded-full px-5"
                            >
                                Plan Your Trip
                            </Button>
                        </Link>
                    </nav>

                    {/* Mobile Nav */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-ivory-100 hover:bg-white/10"
                            >
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72 bg-terracotta-900 border-terracotta-700 p-0"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-5 border-b border-terracotta-700">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-saffron-500">
                                            <Compass className="w-4 h-4 text-terracotta-900" />
                                        </div>
                                        <span className="font-display font-bold text-lg text-ivory-100">
                                            SafarX<span className="text-saffron-400">.in</span>
                                        </span>
                                    </div>
                                    <SheetClose asChild>
                                        <Button variant="ghost" size="icon" className="text-ivory-300 hover:bg-white/10">
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </SheetClose>
                                </div>
                                <nav className="flex flex-col p-4 gap-1 flex-1">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = location.pathname === link.href;
                                        return (
                                            <SheetClose asChild key={link.href}>
                                                <Link
                                                    to={link.href}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm font-medium transition-all ${
                                                        isActive
                                                            ? 'text-saffron-400 bg-white/10'
                                                            : link.href === '/plan'
                                                            ? 'text-saffron-300 hover:text-saffron-200 hover:bg-white/10'
                                                            : link.href === '/admin'
                                                            ? 'text-ivory-400 hover:text-ivory-200 hover:bg-white/10'
                                                            : 'text-ivory-200 hover:text-saffron-300 hover:bg-white/10'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {link.label}
                                                </Link>
                                            </SheetClose>
                                        );
                                    })}
                                </nav>
                                <div className="p-4 border-t border-terracotta-700">
                                    <SheetClose asChild>
                                        <Link to="/contact" search={{}} className="block">
                                            <Button className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body rounded-full">
                                                Plan Your Trip
                                            </Button>
                                        </Link>
                                    </SheetClose>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
