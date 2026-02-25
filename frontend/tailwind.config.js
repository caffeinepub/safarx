import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                display: ['Playfair Display', 'Georgia', 'serif'],
                cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                saffron: {
                    50:  'oklch(0.97 0.04 70)',
                    100: 'oklch(0.93 0.08 65)',
                    200: 'oklch(0.87 0.12 60)',
                    300: 'oklch(0.80 0.16 58)',
                    400: 'oklch(0.75 0.18 56)',
                    500: 'oklch(0.72 0.18 55)',
                    600: 'oklch(0.65 0.18 50)',
                    700: 'oklch(0.58 0.17 45)',
                    800: 'oklch(0.48 0.14 42)',
                    900: 'oklch(0.35 0.10 40)',
                },
                terracotta: {
                    50:  'oklch(0.96 0.03 40)',
                    100: 'oklch(0.90 0.06 38)',
                    200: 'oklch(0.82 0.10 36)',
                    300: 'oklch(0.73 0.13 35)',
                    400: 'oklch(0.65 0.15 35)',
                    500: 'oklch(0.58 0.16 35)',
                    600: 'oklch(0.50 0.15 33)',
                    700: 'oklch(0.42 0.13 32)',
                    800: 'oklch(0.33 0.10 30)',
                    900: 'oklch(0.24 0.07 28)',
                },
                teal: {
                    50:  'oklch(0.96 0.03 195)',
                    100: 'oklch(0.90 0.06 195)',
                    200: 'oklch(0.80 0.08 195)',
                    300: 'oklch(0.68 0.09 195)',
                    400: 'oklch(0.55 0.10 195)',
                    500: 'oklch(0.42 0.10 195)',
                    600: 'oklch(0.36 0.09 200)',
                    700: 'oklch(0.30 0.08 205)',
                    800: 'oklch(0.24 0.06 210)',
                    900: 'oklch(0.18 0.04 215)',
                },
                ivory: {
                    50:  'oklch(0.99 0.005 80)',
                    100: 'oklch(0.97 0.02 80)',
                    200: 'oklch(0.94 0.03 75)',
                    300: 'oklch(0.90 0.04 70)',
                    400: 'oklch(0.85 0.04 65)',
                    500: 'oklch(0.78 0.04 60)',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                card: '0 4px 20px rgba(0,0,0,0.08)',
                'card-hover': '0 12px 40px rgba(0,0,0,0.15)',
                hero: '0 8px 32px rgba(0,0,0,0.3)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-up': 'fade-up 0.6s ease-out forwards',
                'fade-in': 'fade-in 0.4s ease-out forwards',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
