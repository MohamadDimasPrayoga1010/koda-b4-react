/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-primary": "#1D4ED8",
        secondary: "##A0A3BD",
        important: "#D00707",
        active: "#00BA88",
        "title-info": "#4E4B66",
        "title-info-2": "#AAAAAA",
        background: "#F5F6F8",
        "coffee-gradient":
          "linear-gradient(168.18deg, #777C82 -114.74%, #0B0909 91.35%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
