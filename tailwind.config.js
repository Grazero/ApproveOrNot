// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // **สแกนไฟล์ index.html และไฟล์ทั้งหมดในโฟลเดอร์ src/**
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}