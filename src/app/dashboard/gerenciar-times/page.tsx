'use client';

import React, { useState, useEffect } from 'react';
import api from '@/app/api/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AbaTimes: React.FC = () => {
    const [modality, setModality] = useState<string>('futsal');
    const [gender, setGender] = useState<string>('masculino');
    const [grupoDeTurma, setGrupoDeTurma] = useState<string>('');
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [classGroups, setClassGroups] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
    const [selectedTeamPlayers, setSelectedTeamPlayers] = useState<any[]>([]);
    const [teamNameFilter, setTeamNameFilter] = useState<string>('');

    useEffect(() => {
        const fetchClassGroups = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await api.get('/turma/', config);
                setClassGroups(response.data);
            } catch (error: any) {
                console.error(error.response ? error.response.data.message : error.message);
            }
        };

        fetchClassGroups();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (!grupoDeTurma) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await api.get(`/users/${grupoDeTurma}/students`, config);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, [grupoDeTurma]);

    const handleStudentSelection = (studentId: string) => {
        setSelectedStudents(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.post('/teams/', {
                modality,
                gender,
                grupoDeTurma,
                players: selectedStudents
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast({
                title: "Registro de Time",
                description: `Time ${grupoDeTurma} registrado com sucesso!`,
            });
        } catch (error: any) {
            toast({
                title: "Erro ao registrar time",
                variant: "destructive",
                description: error.response ? error.response.data.message : error.message,
            });
            setMessage(error.response?.data.message || 'Erro ao registrar o time');
        }
    };

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found');
                    return;
                }
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await api.get('/teams/', config);
                setTeams(response.data);
                setFilteredTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);
    const handleViewTeamPlayers = async (teamId: string) => {
        console.log('teamId recebido:', teamId); // Adicione este log

        if (!teamId || typeof teamId !== 'string') {
            console.error('Invalid teamId:', teamId); // Adicione este log para capturar o valor
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await api.get(`/teams/${teamId}/players`, config);

            // A resposta já é um array de jogadores
            if (Array.isArray(response.data)) {
                setSelectedTeamPlayers(response.data);
            } else {
                console.error('Invalid response format:', response.data);
                setSelectedTeamPlayers([]);
            }
        } catch (error) {
            console.error("Error fetching team players:", error);
            setSelectedTeamPlayers([]);
        }
    };





    const handleTeamNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamNameFilter(event.target.value);
        if (event.target.value === '') {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(teams.filter(team => team.nome.toLowerCase().includes(event.target.value.toLowerCase())));
        }
    };

    return (
        <div>
            <Link href="/dashboard" legacyBehavior passHref>
                <span className="absolute top-4 left-4 flex items-center gap-1"> <FaArrowLeft /> Voltar</span>
            </Link>
            <div className='flex justify-center items-center flex-col'>
                <h1 className='text-4xl flex justify-center pb-3'>Gerenciar Times</h1>
                <Tabs defaultValue="register" className="w-full">
                    <TabsList className="flex w-full">
                        <TabsTrigger value="register" className="flex-1 text-center">Registrar Times</TabsTrigger>
                        <TabsTrigger value="search" className="flex-1 text-center">Pesquisar Times</TabsTrigger>
                    </TabsList>
                    <TabsContent value="register" className='w-[600px] h-[400px]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                    Registrar Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="modality">Modalidade:</Label>
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
                                        <Label htmlFor="gender">Gênero:</Label>
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
                                    <div>
                                        <Label htmlFor="grupoDeTurma">Grupo de Turma:</Label>
                                        <Select value={grupoDeTurma} onValueChange={(value) => setGrupoDeTurma(value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o grupo de turma" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Grupos de Turma</SelectLabel>
                                                    {classGroups.map((group) => (
                                                        <SelectItem key={group._id} value={group._id}>
                                                            {group.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {students.length > 0 && (
                                        <div>
                                            <Label>Alunos:</Label>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead></TableHead>
                                                        <TableHead>Nome</TableHead>
                                                        <TableHead>E-mail</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {students.map(student => (
                                                        <TableRow key={student._id}>
                                                            <TableCell>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStudents.includes(student._id)}
                                                                    onChange={() => handleStudentSelection(student._id)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{student.nome}</TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                    <Button type="submit">Registrar</Button>
                                </form>
                                {message && <p>{message}</p>}
                            </CardContent>
                        </Card>
                    </TabsContent> 
                    <TabsContent value="search" className='w-[600px] h-[400px]'>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                    Pesquisar Times
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        placeholder="Filtrar por nome do time"
                                        value={teamNameFilter}
                                        onChange={handleTeamNameFilterChange}
                                    />
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nome</TableHead>
                                                <TableHead>Modalidade</TableHead>
                                                <TableHead>Gênero</TableHead>
                                                <TableHead>Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTeams.map(team => (

                                                <TableRow key={team._id}>
                                                    <TableCell>{team.nome}</TableCell>
                                                    <TableCell>{team.modalidade}</TableCell>
                                                    <TableCell>{team.genero}</TableCell>
                                                    <TableCell>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button onClick={() => {
                                                                    console.log('teamId ao clicar:', team._id); // Adicione este log
                                                                    handleViewTeamPlayers(team._id);
                                                                }}>
                                                                    Visualizar Jogadores
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Jogadores do Time</DialogTitle>
                                                                </DialogHeader>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Nome</TableHead>
                                                                            <TableHead>E-mail</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {(Array.isArray(selectedTeamPlayers) ? selectedTeamPlayers : []).map(player => (
                                                                            <TableRow key={player._id}>
                                                                                <TableCell>{player.nome}</TableCell>
                                                                                <TableCell>{player.email}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>


                                                                </Table>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>

                                            ))}



                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default AbaTimes;
