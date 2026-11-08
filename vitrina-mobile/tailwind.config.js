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
      fontFamily: {
        lora: ["Lora_700Bold"],
        nunito: ["NunitoSans_400Regular"],
        "nunito-semibold": ["NunitoSans_600SemiBold"],
        "nunito-bold": ["NunitoSans_700Bold"],
      },
    },
  },
  plugins: [],
};
