"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@apollo/client/react";
import { client } from "../../apolloClient";
import { Toaster } from "@/components/ui/sonner";
import UserBootstrapper from "@/components/custom/ProtectedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={client}>
          <Toaster />
          <UserBootstrapper />
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
