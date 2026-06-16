import type { Metadata } from "next";
import { Italiana, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const italiana = Italiana({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quietude — A Nature Experience",
  description:
    "A cinematic journey through forests, water, and the night sky. Pause. Breathe. Reconnect with nature.",
  keywords: [
    "nature",
    "cinematic",
    "mindfulness",
    "forest",
    "ocean",
    "night sky",
    "calm",
  ],
  authors: [{ name: "Quietude" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Quietude — A Nature Experience",
    description: "A cinematic journey through forests, water, and the night sky.",
    siteName: "Quietude",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${italiana.variable} ${outfit.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
