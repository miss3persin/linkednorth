/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0b132b',      // dark navy used in header text/buttons
        accent: '#2dd4bf',       // teal-ish accent if needed
        brand: '#111827',        // near black for footer
        muted: '#6b7280',        // gray-500
        success: '#10b981',      // green
      },
    },
    container: {
      center: true,
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    
  },
  plugins: [],
};
