import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { loadCloudProgressForUser } from "@/lib/load-cloud-progress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Allegro 100 Blitz — Подготовка к интервью",
  description:
    "100 блиц-наборов с 900 вопросами для подготовки к Allegro e-Xperience 2026",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, progress } = await loadCloudProgressForUser();
  const isSignedIn = !!user;

  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
        >
          К основному содержимому
        </a>
        <SiteHeader />
        <ProgressProvider
          isSignedIn={isSignedIn}
          initialCloudProgress={progress}
        >
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
        </ProgressProvider>
      </body>
    </html>
  );
}
