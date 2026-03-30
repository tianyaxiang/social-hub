import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#1D9BF0',
        'accent-hover': '#1A8CD8',
        dark: {
          bg: '#000000',
          card: '#16181C',
          border: '#2F3336',
          text: '#E7E9EA',
          'text-secondary': '#71767B',
        },
        light: {
          bg: '#FFFFFF',
          card: '#F7F9F9',
          border: '#EFF3F4',
          text: '#0F1419',
          'text-secondary': '#536471',
        },
      },
      maxWidth: {
        'feed': '600px',
      },
      width: {
        'rail': '240px',
        'sidebar': '350px',
      },
    },
  },
  plugins: [],
};

export default config;
