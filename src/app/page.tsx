"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Usar 'next/navigation' em vez de 'next/router'
import api from "./api/api";
import { useAuth } from "./context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { identifier, senha });
      const { data } = response;

      if (data && data.token && data.data) {
        login(data.data, data.token);
        router.push("/home");
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    
    <section className="flex bg-background h-full max-w-3xl w-full p-4 items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <img src="images/logo.png" alt="" width="150" height="150" />
          </CardTitle>
          <CardDescription className="flex items-center justify-center">
            Utilize sua matricula e senha para logar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="matricula">Matricula</Label>
              <Input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Registro"
                required
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="senha">Senha</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
              /> 
              
            </div>
            <Button className="mt-6 w-full">Logar</Button>
            <div className="flex items-center gap-16 mt-4">
              <Separator></Separator>
            </div>
            <Button variant="link" className="w-full">
              Esqueceu Senha?
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Login;
