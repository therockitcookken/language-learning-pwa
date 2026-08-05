import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'canvas-ink': '#030712',
        'pure-surface': 'rgba(15, 23, 42, 0.85)',
        'whisper-border': 'rgba(255, 255, 255, 0.1)',
        'muted-steel': '#94a3b8',
        'titanium-white': '#f8fafc',
        'safety-orange': '#f97316',
        'gold-amber': '#f59e0b',
      },
    },
  },
  plugins: [],
};
export default config;
