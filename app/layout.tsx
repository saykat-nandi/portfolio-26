import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, Geist_Mono } from "next/font/google";
import { site } from "@/content/portfolio";
import { AnimateUIRoot } from "@/components/AnimateUIRoot";
import { SmoothScroll } from "@/components/SmoothScroll";
import { GridHud } from "@/components/GridHud";
import "./globals.css";
import "./industrial.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#DFDEDA" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${interTight.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">
        <AnimateUIRoot>
          <SmoothScroll>
            {children}
            <GridHud />
          </SmoothScroll>
        </AnimateUIRoot>
      </body>
    </html>
  );
}
