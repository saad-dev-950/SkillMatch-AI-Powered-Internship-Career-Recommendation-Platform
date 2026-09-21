import type { Metadata } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillMatch — AI-Powered Internship & Career Recommendation Platform",
  description: "Connect students with high-match internships using explainable AI and skill-gap diagnostic intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
