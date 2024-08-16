import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/app/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "@next/font/google";

// Importando a fonte Poppins 
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Classificação",
    description: "Generated by create next app",
};

export default function GerenicarAlunosLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <div className={poppins.className}>
                    {children}
                    <Toaster />
                </div>
            </ThemeProvider>
        </AuthProvider>
    );
}
