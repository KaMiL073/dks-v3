import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { LiveDataRefresh } from "@/components/LiveDataRefresh";
import "./globals.css";

export const metadata: Metadata = { title: "DKS CUP", description: "Turniej DKS CUP na żywo" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pl"><body><AuthProvider><LiveDataRefresh/>{children}</AuthProvider></body></html>; }
