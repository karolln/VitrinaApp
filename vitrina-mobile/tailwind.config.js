/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        vitrina: {
          azul: "#1F4E6B",
          fondo: "#E3ECEC",
          mostaza: "#F0B429",
          ladrillo: "#B5452C",
          tinta: "#102A43",
          borde: "#C9D6DC",
        },
      },
    },
  },
  plugins: [],
};
