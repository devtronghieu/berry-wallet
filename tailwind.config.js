/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      primary: {
        100: "#FCEBEE",
        200: "#F7C3CC",
        300: "#F29AAA",
        400: "#EF5385",
        500: "#C33160",
      },
      secondary: {
        100: "#A6D9DA",
        200: "#99CFD0",
        300: "#73B1B3",
        400: "#54999C",
        500: "#267578",
      },
      tertiary: {
        100: "#FFDFBE",
        200: "#C69881",
        300: "#491F27",
      },
      gray: {
        100: "#E8E8E8",
        200: "#D2D2D2",
        300: "#A5A5A5",
        400: "#777777",
        500: "#4A4A4A",
      },
      error: "#EC044E",
      success: "#30A13F",
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  safelist: [
    {
      pattern: /rounded-(xl|2xl|full)/,
    }
  ],
  plugins: [],
};
