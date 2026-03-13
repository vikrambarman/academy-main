import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  // ⚠️ v4 me darkMode yahan kaam nahi karta — globals.css me @variant se handle hota hai
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typography],
};

export default config;