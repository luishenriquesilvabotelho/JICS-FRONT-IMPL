"use client"
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();
  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <CardTitle>Escolha um Tema </CardTitle>
          <CardDescription >
            Escolha o melhor tema para sua visão
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-x-3 flex flex-row items-center justify-center">
          <Button onClick={() => setTheme('Light')}>Light</Button>
          <p className="flex items-center">ou</p>
          <Button onClick={() => setTheme('dark')}>Dark</Button>
        </CardContent>
      </Card>
    </>
  );
}