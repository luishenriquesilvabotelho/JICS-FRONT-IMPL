"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function MeuPerfil() {
    const { user } = useAuth();
    return (
        <div>
            <Link href="/home" legacyBehavior passHref >
                <span className="absolute top-4 left-4 flex items-center gap-1"> <FaArrowLeft /> Voltar</span>
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle>Meu Perfil </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{user?.nome}</p>
                    <p>{user?.email}</p>
                    <p>{user?.grupoDeTurma}</p>
                    <p>{user?.role}</p>
                </CardContent>
            </Card>
        </div>
    );
}