"use client";
import React, { useState } from "react";
import dynamic from 'next/dynamic';
import api from "@/app/api/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const SorteioTimes: React.FC = () => {
  const [modality, setModality] = useState<string>("futsal");
  const [gender, setGender] = useState<string>("male");
  const [message, setMessage] = useState<string>('');

  const handleDraw = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await api.post("/teams/draw-teams", { modality, gender }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Draw created successfully!");
    } catch (error: any) {
      setMessage(error.response?.data.message || "Error creating draw");
    }
  };

  return (
    <div>
      <div>
        <Link href="/dashboard" legacyBehavior passHref >
          <span className="absolute top-4 left-4 flex items-center gap-1"> <FaArrowLeft /> Voltar</span>
        </Link>
      </div>
      <Card className="max-w-md mx-auto p-4">
        <CardHeader>
          <CardTitle>Realizar Sorteio dos Grupos</CardTitle>
          <CardDescription>Selecione a modalidade e o gênero para realizar o sorteio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Select value={modality} onValueChange={(value) => setModality(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Modalidades</SelectLabel>
                    <SelectItem value="futsal">Futsal</SelectItem>
                    <SelectItem value="volei">Voleibol</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={gender} onValueChange={(value) => setGender(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gênero</SelectLabel>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleDraw} className="w-full">Realizar Sorteio</Button>
            {message && <p className="text-center mt-2">{message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SorteioTimes;
