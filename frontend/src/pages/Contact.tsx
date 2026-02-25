import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Loader2, Mail, Phone, Send } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import { useSearch } from '@tanstack/react-router';
import { useSubmitInquiry } from '@/hooks/useQueries';
import { destinations } from '@/data/destinations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FormData {
    name: string;
    email: string;
    phone: string;
    destination: string;
    message: string;
}

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const { mutateAsync, isPending } = useSubmitInquiry();
    const search = useSearch({ from: '/contact' });
    const prefilledDestination = (search as { destination?: string; travelInterest?: string }).destination
        || (search as { destination?: string; travelInterest?: string }).travelInterest
        || '';

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        defaultValues: {
            destination: prefilledDestination,
            phone: '',
            message: prefilledDestination ? `I'm interested in the "${prefilledDestination}" package. Please share more details.` : '',
        },
    });

    const selectedDestination = watch('destination');

    // Sync prefilled destination when search param changes
    useEffect(() => {
        if (prefilledDestination) {
            setValue('destination', prefilledDestination, { shouldValidate: false });
            setValue('message', `I'm interested in the "${prefilledDestination}" package. Please share more details.`, { shouldValidate: false });
        }
    }, [prefilledDestination, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            await mutateAsync({
                name: data.name,
                email: data.email,
                destination: data.destination,
                message: data.message,
                phone: data.phone || '',
            });
            setSubmitted(true);
            reset();
        } catch (err) {
            console.error('Failed to submit inquiry:', err);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            {/* Page Header */}
            <div
                className="relative pt-32 pb-20 overflow-hidden"
                style={{
                    backgroundImage: `url(/assets/generated/dest-varanasi.dim_800x600.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-terracotta-900/80" />
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block font-body text-xs font-semibold text-saffron-400 uppercase tracking-widest mb-3">
                        Let's Connect
                    </span>
                    <h1 className="font-display font-black text-4xl sm:text-5xl text-ivory-100 mb-4 text-shadow-hero">
                        Plan Your Dream Journey
                    </h1>
                    <p className="font-cormorant italic text-xl text-ivory-200 max-w-xl mx-auto">
                        Tell us where you want to go, and we'll craft the perfect Indian adventure for you.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="font-display font-bold text-2xl text-foreground mb-3">
                                Get in Touch
                            </h2>
                            <p className="font-body text-muted-foreground text-sm leading-relaxed">
                                Our travel experts are ready to help you plan an unforgettable journey through India. Reach out and let's start crafting your story.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {[
                                {
                                    icon: Mail,
                                    label: 'Email Us',
                                    value: 'travelsafarx@gmail.com',
                                    href: 'mailto:travelsafarx@gmail.com',
                                    color: 'bg-saffron-100 text-saffron-700',
                                },
                                {
                                    icon: Phone,
                                    label: 'Call Us',
                                    value: '+91 8979695644',
                                    href: 'tel:+918979695644',
                                    color: 'bg-teal-100 text-teal-700',
                                },
                                {
                                    icon: SiInstagram,
                                    label: 'Instagram',
                                    value: '@SafarX.in',
                                    href: 'https://www.instagram.com/SafarX.in',
                                    color: 'bg-terracotta-100 text-terracotta-700',
                                },
                            ].map(({ icon: Icon, label, value, href, color }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {label}
                                        </p>
                                        <a
                                            href={href}
                                            className="font-body text-sm font-medium text-foreground hover:text-saffron-600 transition-colors"
                                            target={label === 'Instagram' ? '_blank' : undefined}
                                            rel={label === 'Instagram' ? 'noopener noreferrer' : undefined}
                                        >
                                            {value}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Decorative quote */}
                        <div className="bg-saffron-50 border-l-4 border-saffron-400 rounded-r-xl p-5">
                            <p className="font-cormorant italic text-lg text-terracotta-800 leading-relaxed">
                                "Every journey begins with a single step — let us help you take that first step towards an extraordinary adventure."
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3">
                        {submitted ? (
                            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                                </div>
                                <h3 className="font-display font-bold text-2xl text-teal-800 mb-3">
                                    Enquiry Sent!
                                </h3>
                                <p className="font-body text-teal-700 text-sm leading-relaxed max-w-sm mb-6">
                                    Thank you for reaching out! Our travel experts will get back to you within 24 hours to craft your perfect journey.
                                </p>
                                <Button
                                    onClick={() => setSubmitted(false)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-body"
                                >
                                    Send Another Enquiry
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                                <h3 className="font-display font-bold text-xl text-foreground mb-6">
                                    Send Us an Enquiry
                                </h3>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="font-body text-sm font-medium text-foreground">
                                            Full Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Your full name"
                                            {...register('name', { required: 'Name is required' })}
                                            className="font-body border-border focus:border-saffron-500"
                                        />
                                        {errors.name && (
                                            <p className="font-body text-xs text-red-500">{errors.name.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="font-body text-sm font-medium text-foreground">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: 'Enter a valid email address',
                                                },
                                            })}
                                            className="font-body border-border focus:border-saffron-500"
                                        />
                                        {errors.email && (
                                            <p className="font-body text-xs text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phone" className="font-body text-sm font-medium text-foreground">
                                            Phone Number <span className="font-normal text-muted-foreground">(optional)</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            {...register('phone')}
                                            className="font-body border-border focus:border-saffron-500"
                                        />
                                    </div>

                                    {/* Destination */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="destination" className="font-body text-sm font-medium text-foreground">
                                            Destination of Interest <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={selectedDestination}
                                            onValueChange={(val) => setValue('destination', val, { shouldValidate: true })}
                                        >
                                            <SelectTrigger className="font-body border-border focus:border-saffron-500">
                                                <SelectValue placeholder="Select a destination" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {destinations.map((dest) => (
                                                    <SelectItem key={dest.id} value={dest.name} className="font-body">
                                                        {dest.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <input
                                            type="hidden"
                                            {...register('destination', { required: 'Please select a destination' })}
                                        />
                                        {errors.destination && (
                                            <p className="font-body text-xs text-red-500">{errors.destination.message}</p>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="message" className="font-body text-sm font-medium text-foreground">
                                            Your Message <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your travel plans, group size, preferred dates, budget, or any special requirements..."
                                            rows={4}
                                            {...register('message', { required: 'Message is required' })}
                                            className="font-body border-border focus:border-saffron-500 resize-none"
                                        />
                                        {errors.message && (
                                            <p className="font-body text-xs text-red-500">{errors.message.message}</p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-terracotta-700 hover:bg-terracotta-800 text-ivory-100 font-body font-semibold py-3 h-auto"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Sending Enquiry…
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Enquiry
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
