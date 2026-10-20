import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata: Metadata = { title: "LovyGo — spolu, i když na dálku", description: "Soukromý prostor pro dva. Vzpomínky, společné plány a malé každodenní okamžiky." };
export const viewport: Viewport = { themeColor: "#f8f7fc", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang="cs"><body>{children}</body></html>; }
