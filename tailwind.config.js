/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // for App Router structure
    "./node_modules/@mui/material/**/*.{js,ts,jsx,tsx}", // MUI components if needed
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      colors: {
        brand: {
          900: "#1a365d",
          800: "#153e75",
          700: "#2a69ac",
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // keep preflight enabled
  },
};
