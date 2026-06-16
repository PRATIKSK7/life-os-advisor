import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeOS AI Advisor",
  description: "Your personal AI life coach and scheduler",
};

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AppProvider } from "@/lib/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className="flex h-screen overflow-hidden selection:bg-blue-500/30">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
              {/* Decorative background blur */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-50 pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] opacity-50 pointer-events-none" />
              
              <Header />
              <main className="flex-1 overflow-y-auto p-8 z-0">
                {children}
              </main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
