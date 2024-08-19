"use client";
import React, { useEffect, useState } from 'react';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateScore from '../update-scores/page';
import { MainNav } from '@/components/main-nav';
import { Label } from '@/components/ui/label';

interface Team {
  _id: string;
  grupoDeTurma: { nome: string };
}

interface Match {
  _id: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  played: boolean;
  date: string | null;
}

interface UpdateScoreProps {
  match: {
    _id: string;
    teamA: { _id: string; name: string };
    teamB: { _id: string; name: string };
    scoreA: number;
    scoreB: number;
    played: boolean;
    date: string | null;
  };
  onUpdate: () => void;
}

const Standings: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [modality, setModality] = useState<string>('futsal');
  const [gender, setGender] = useState<string>('masculino');
  const [updateToggle, setUpdateToggle] = useState<boolean>(false);

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        console.log(`Fetching matches for modality: ${modality}, gender: ${gender}`);
        const response = await api.get(`/teams/matches/${modality}/${gender}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Matches fetched:", response.data);
        setMatches(response.data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [modality, gender, updateToggle]);


  const handleScoreUpdate = () => {
    setUpdateToggle(!updateToggle);
  };

  const transformMatchForUpdateScore = (match: Match): UpdateScoreProps['match'] => ({
    _id: match._id,
    teamA: { _id: match.teamA._id, name: match.teamA.grupoDeTurma.nome },
    teamB: { _id: match.teamB._id, name: match.teamB.grupoDeTurma.nome },
    scoreA: match.scoreA,
    scoreB: match.scoreB,
    played: match.played,
    date: match.date,
  });

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 w-full h-18 z-50  backdrop-blur-md shadow-md">
        <MainNav />
      </div>

      <div className="flex-grow mx-auto p-4 max-w-3xl mt-12">
        <h1 className="text-xl font-bold text-center mb-4">Classificação</h1>
        <div className="mb-4">
          <Label htmlFor="modality" className="block text-center mb-2">Modalidade:</Label>
          <Select onValueChange={(value) => setModality(value)} >
            <SelectTrigger>
              <SelectValue placeholder="Select Modality" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Modality</SelectLabel>
                <SelectItem value="futsal">Futsal</SelectItem>
                <SelectItem value="volei">Volleyball</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className='mt-3'>
            <Select onValueChange={(value) => setGender(value)} >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gender</SelectLabel>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela com rolagem */}
        <div className="max-h-96  ">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Team A</TableHead>
                <TableHead>Team B</TableHead>
                <TableHead>Score A</TableHead>
                <TableHead>Score B</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {matches.map((match) => (
                <TableRow key={match._id}>
                  <TableCell>{match.teamA.grupoDeTurma.nome}</TableCell>
                  <TableCell>{match.teamB.grupoDeTurma.nome}</TableCell>
                  <TableCell>{match.scoreA}</TableCell>
                  <TableCell>{match.scoreB}</TableCell>
                  <TableCell>
                    <UpdateScore match={transformMatchForUpdateScore(match)} onUpdate={handleScoreUpdate} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </div>
    </div>
  );

};

export default Standings;
