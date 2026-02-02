import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#0f0b1e',
        'dark-secondary': '#1a162e',
        'primary-purple': '#6d28d9',
        'secondary-purple': '#8b5cf6',
        'accent-purple': '#a78bfa',
      },
    },
  },
  plugins: [],
};
export default config;