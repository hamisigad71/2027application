import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Footer } from "@/components/footer";
import { PageNavigator } from "@/components/page-navigator";
import { GlobalFloatingNav } from "@/components/global-floating-nav";
import { ToastProvider } from "@/components/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Affordable Housing Planning Tool",
  description:
    "Plan and simulate affordable housing projects with real-time cost and impact analysis",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen overflow-x-hidden w-screen`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <AuthProvider>
            <GlobalFloatingNav />
            <div className="flex-1 w-full overflow-hidden flex flex-col">
              {children}
            </div>
            <Footer />
            <div className="w-full px-4 sm:px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200/50 dark:border-slate-700/50 flex justify-center">
              <PageNavigator />
            </div>
          </AuthProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
