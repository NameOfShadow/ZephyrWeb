// app/layout.tsx
import type { Metadata } from "next";
import {Geist, Geist_Mono, Inter} from "next/font/google";
import AuthProvider from "@/components/auth/AuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        template: "%s | Zephyr",
        default: "Zephyr - Messaging Redefined",
    },
    description: "Где каждая мысль летит без задержек: приватные чаты, минимум интерфейса, максимум смысла.",
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    )
}