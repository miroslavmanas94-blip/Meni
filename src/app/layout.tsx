import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = {
 title: "DUO ❤️ — Hry pro dva odkudkoliv",
 description: "Romantické, vtipné a společné hry pro dva. Osobně nebo na dálku, s hlasovými i videohovory.",
 applicationName: "DUO",
 manifest: "/manifest.webmanifest",
 appleWebApp: { capable: true, statusBarStyle: "default", title: "DUO" },
 icons: { icon: "/duo-icon.svg", apple: "/duo-icon.svg" },
};
export const viewport: Viewport = { themeColor: "#fff7fb", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang="cs"><body>{children}</body></html>; }
