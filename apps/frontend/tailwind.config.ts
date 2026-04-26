import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                bg: 'rgb(var(--bg) / <alpha-value>)',
                panel: 'rgb(var(--panel) / <alpha-value>)',
                panel2: 'rgb(var(--panel2) / <alpha-value>)',
                text: 'rgb(var(--text) / <alpha-value>)',
                muted: 'rgb(var(--muted) / <alpha-value>)',
                border: 'rgb(var(--border) / <alpha-value>)',
                accent: 'rgb(var(--accent) / <alpha-value>)',
                accent2: 'rgb(var(--accent2) / <alpha-value>)',
                violet: 'rgb(var(--violet) / <alpha-value>)',
                violet2: 'rgb(var(--violet2) / <alpha-value>)',
                danger: 'rgb(var(--danger) / <alpha-value>)',
            },
            borderRadius: {
                xl: '14px',
                '2xl': '18px',
                '3xl': '24px',
                pill: '9999px',
            },
            boxShadow: {
                soft: '0 12px 40px rgba(0,0,0,0.35)',
                glow: '0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.5)',
                neon: '0 0 24px rgba(0,255,133,0.35)',
            },
            keyframes: {
                floaty: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
            },
            animation: {
                floaty: 'floaty 4s ease-in-out infinite',
            },
        },
    },
    plugins: [],
};

export default config;