"use client";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '../api/api';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MainNav } from '@/components/main-nav';

interface Team {
  _id: string;
  grupoDeTurma: {
    nome: string;
  };
  modality: string;
  gender: string;
  futsalStats?: {
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
  };
  volleyballStats?: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    setsWon: number;
    setsLost: number;
    points: number;
  };
}

interface Group {
  name: string;
  teams: Team[];
}

interface Draw {
  modality: string;
  groups: Group[];
}

const Classificacao: React.FC = () => {
  const [modality, setModality] = useState<string>('futsal');
  const [gender, setGender] = useState<string>('masculino');
  const [draw, setDraw] = useState<Draw | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDraw = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await api.get(`/teams/draws/${modality}?gender=${gender}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.groups && response.data.groups.length > 0) {
          setDraw(response.data);
        } else {
          setDraw(null); // Limpa o estado se não houver sorteio
        }
      } catch (error: any) {
        console.error(error.response?.data.message || 'Error fetching draw');
        setDraw(null); // Limpa o estado em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchDraw();
  }, [modality, gender]);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 w-full h-18 z-50  backdrop-blur-md shadow-md">
        <MainNav />
      </div>

      <div className="flex-grow  mx-auto p-4 max-w-3xl mt-44 ">
        <h1 className="text-xl font-bold text-center mb-4">Classificação</h1>
        <div className="mb-4">
          <Label htmlFor="modality" className="block text-center mb-2">Modalidade:</Label>
          <Select value={modality} onValueChange={(value) => setModality(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a Modalidade" />
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
        <div className="mb-4">
          <Label htmlFor="gender" className="block text-center mb-2">Gênero:</Label>
          <Select value={gender} onValueChange={(value) => setGender(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o gênero " />
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
        {loading ? (
          <p className="text-center">Carregando...</p>
        ) : draw && draw.groups.length > 0 ? (
          draw.groups.map((group, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-lg font-semibold text-center mb-4">{group.name}</h2>
              <div className="overflow-x-auto">
                <Table className="w-full table-auto">
                  <TableHeader className='border-b-2 border-white'>
                    <TableRow>
                      <TableHead className="px-2 py-1 text-sm text-white">Times</TableHead>
                      <TableHead className="px-2 py-1 text-sm text-white">Jogos</TableHead>
                      <TableHead className="px-2 py-1 text-sm text-white">Vitórias</TableHead>
                      {modality === 'futsal' ? (
                        <>
                          <TableHead className="px-2 py-1 text-sm text-white">Empate</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Derrotas</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Gols Pró</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Gols Contra</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Saldo</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="px-2 py-1 text-sm text-white">Derrotas</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Sets Vencidos</TableHead>
                          <TableHead className="px-2 py-1 text-sm text-white">Sets Perdidos</TableHead>
                        </>
                      )}
                      <TableHead className="px-2 py-1 text-sm text-white">Pontos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.teams.map((team) => (
                      <TableRow key={team._id}>
                        <TableCell className="px-2 py-1 text-sm text-white">{team.grupoDeTurma?.nome}</TableCell>
                        <TableCell className="px-2 py-1 text-sm text-white">{team[modality === 'futsal' ? 'futsalStats' : 'volleyballStats']?.gamesPlayed}</TableCell>
                        <TableCell className="px-2 py-1 text-sm text-white">{team[modality === 'futsal' ? 'futsalStats' : 'volleyballStats']?.wins}</TableCell>
                        {modality === 'futsal' ? (
                          <>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.futsalStats?.draws}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.futsalStats?.losses}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.futsalStats?.goalsFor}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.futsalStats?.goalsAgainst}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.futsalStats?.goalDifference}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.volleyballStats?.losses}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.volleyballStats?.setsWon}</TableCell>
                            <TableCell className="px-2 py-1 text-sm text-white">{team.volleyballStats?.setsLost}</TableCell>
                          </>
                        )}
                        <TableCell className="px-2 py-1 text-sm">{team[modality === 'futsal' ? 'futsalStats' : 'volleyballStats']?.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div> 
          ))
        ) : (
          <p className="text-center">Não há sorteio para o gênero e modalidade selecionada.</p>
        )}
      </div>
    </div>
  );
};

export default Classificacao;
