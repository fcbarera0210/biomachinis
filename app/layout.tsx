import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Biomachinis - Noticias de Workout",
  description: "Plataforma de noticias deportivas enfocada en Workout y superación personal",
  icons: {
    icon: "/svg/logo-bm.svg",
    apple: "/svg/logo-bm.svg",
  },
  openGraph: {
    title: "Biomachinis - Noticias de Workout",
    description: "Plataforma de noticias deportivas enfocada en Workout y superación personal",
    url: baseUrl,
    siteName: "Biomachinis",
    images: [
      {
        url: `${baseUrl}/svg/logo-bm.svg`,
        width: 1079,
        height: 1079,
        alt: "Biomachinis",
      },
    ],
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biomachinis - Noticias de Workout",
    description: "Plataforma de noticias deportivas enfocada en Workout y superación personal",
    images: [`${baseUrl}/svg/logo-bm.svg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
