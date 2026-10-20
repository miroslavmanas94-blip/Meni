import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { lovygo: { violet: "#8171DE", pink: "#F2B7D4", ink: "#292638", muted: "#858196" } }, boxShadow: { soft: "0 18px 55px rgba(64, 46, 112, .09)" } } }, plugins: [] };
export default config;
