import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Clock } from 'lucide-react';
import { useSubmitInquiry } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useSEO from '@/hooks/useSEO';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    destination: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        destination: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const submitInquiry = useSubmitInquiry();

    useSEO({
        title: 'Contact Us',
        description:
            'Get in touch with SafarX for personalised India travel planning. Enquire about destinations, packages, custom itineraries, or group tours — our travel experts are ready to help.',
        ogTitle: 'Contact SafarX — Plan Your India Trip Today',
        ogDescription:
            'Reach out to SafarX travel experts for personalised India trip planning. Enquire about destinations, packages, custom itineraries, or group tours — we\'re here to help.',
        ogImage: '/assets/generated/safarx-logo.dim_400x120.png',
        ogUrl: 'https://safarx.in/contact',
        ogType: 'website',
        twitterCard: 'summary',
        twitterTitle: 'Contact SafarX — Plan Your India Trip Today',
        twitterDescription:
            'Reach out to SafarX travel experts for personalised India trip planning. Enquire about destinations, packages, custom itineraries, or group tours — we\'re here to help.',
        twitterImage: '/assets/generated/safarx-logo.dim_400x120.png',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitInquiry.mutateAsync({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                destination: formData.destination,
                message: formData.message,
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit inquiry:', err);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-terracotta-800 pt-32 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-3">
                        Get in Touch
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-ivory-100 mb-4">
                        Plan Your Dream Trip
                    </h1>
                    <p className="font-cormorant italic text-xl text-ivory-200 max-w-xl mx-auto">
                        Tell us about your travel dreams and our experts will craft the perfect Indian adventure for you.
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        {/* Contact Info Sidebar */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                                    Contact Information
                                </h2>
                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-saffron-100 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-saffron-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                                            <a
                                                href="mailto:travelsafarx@gmail.com"
                                                className="font-body text-sm text-foreground font-medium hover:text-primary transition-colors"
                                            >
                                                travelsafarx@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Phone / WhatsApp</p>
                                            <a
                                                href="tel:+918979695644"
                                                className="font-body text-sm text-foreground font-medium hover:text-primary transition-colors"
                                            >
                                                +91 8979695644
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                                            <Instagram className="w-5 h-5 text-terracotta-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Instagram</p>
                                            <a
                                                href="https://instagram.com/SafarX.in"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-body text-sm text-foreground font-medium hover:text-primary transition-colors"
                                            >
                                                @SafarX.in
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-saffron-100 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-saffron-600" />
                                        </div>
                                        <div>
                                            <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Response Time</p>
                                            <p className="font-body text-sm text-foreground font-medium">Within 24 hours</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="bg-saffron-50 border border-saffron-200 rounded-2xl p-6">
                                <h3 className="font-display font-semibold text-base text-terracotta-800 mb-3">
                                    Why Choose SafarX?
                                </h3>
                                <ul className="space-y-2">
                                    {[
                                        'Personalised itineraries',
                                        'Expert local knowledge',
                                        'Best price guarantee',
                                        '24/7 travel support',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center gap-2 font-body text-sm text-terracotta-700">
                                            <span className="text-saffron-500">✓</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            {submitted ? (
                                <div className="bg-card border border-border rounded-3xl p-10 text-center shadow-card">
                                    <div className="text-5xl mb-4">🎉</div>
                                    <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                                        Thank You!
                                    </h2>
                                    <p className="font-body text-muted-foreground mb-6 max-w-sm mx-auto">
                                        Your inquiry has been received. Our travel experts will get back to you within 24 hours.
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
                                        }}
                                        className="bg-terracotta-700 hover:bg-terracotta-800 text-ivory-100 font-body rounded-full"
                                    >
                                        Send Another Inquiry
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-card">
                                    <h2 className="font-display font-bold text-2xl text-foreground mb-6">
                                        Send Us a Message
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="name" className="font-body text-sm font-medium text-foreground">
                                                    Full Name <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Your full name"
                                                    className="font-body text-sm bg-background border-border rounded-xl h-11"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="email" className="font-body text-sm font-medium text-foreground">
                                                    Email Address <span className="text-destructive">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="your@email.com"
                                                    className="font-body text-sm bg-background border-border rounded-xl h-11"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="phone" className="font-body text-sm font-medium text-foreground">
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="font-body text-sm bg-background border-border rounded-xl h-11"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="destination" className="font-body text-sm font-medium text-foreground">
                                                    Destination of Interest
                                                </Label>
                                                <Input
                                                    id="destination"
                                                    name="destination"
                                                    value={formData.destination}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Rajasthan, Kerala…"
                                                    className="font-body text-sm bg-background border-border rounded-xl h-11"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="message" className="font-body text-sm font-medium text-foreground">
                                                Your Message <span className="text-destructive">*</span>
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder="Tell us about your travel plans, group size, budget, and any special requirements…"
                                                rows={5}
                                                className="font-body text-sm bg-background border-border rounded-xl resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={submitInquiry.isPending}
                                            className="w-full bg-terracotta-700 hover:bg-terracotta-800 text-ivory-100 font-body font-semibold rounded-full h-12 gap-2 border-0"
                                        >
                                            {submitInquiry.isPending ? (
                                                <>
                                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-ivory-100/30 border-t-ivory-100 rounded-full" />
                                                    Sending…
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Inquiry
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
