import { ReactQueryProvider } from "@/lib/react-query-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Diary",
  description: "A diary where I will post updates on how I feel during the day when struggling with symptoms of thoracic outlet syndrome. So I can focus on what triggers it and to track the journey more effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={"dark"}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        <Toaster />
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}