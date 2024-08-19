"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css"; // Adicione seus estilos globais aqui
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log("Client-side hydration");
  }, []);

  return (
    <html lang="en" className={poppins.className}>
      <head>
        <title>Página de Login</title>
      </head>
      <body className="h-screen w-full flex items-center justify-center">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
