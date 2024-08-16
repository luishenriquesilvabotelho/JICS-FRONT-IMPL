'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/api/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link';

interface Turma {
    _id: string;
    nome: string;
}

interface User {
    _id: string;
    nome: string;
    genero: string;
    email: string;
    numeroDeRegistro: string;
    role: string;
    grupoDeTurma: Turma;
}

const AbaUser: React.FC = () => {
    const { toast } = useToast();
    const router = useRouter();

    // State for registering user
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('masculino');
    const [email, setEmail] = useState('');
    const [numeroDeRegistro, setNumeroDeRegistro] = useState('');
    const [role, setRole] = useState('student');
    const [grupoDeTurma, setGrupoDeTurma] = useState('');
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [senha, setSenha] = useState('');

    // State for listing and managing users
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);

    // State for editing user
    const [editNome, setEditNome] = useState('');
    const [editGenero, setEditGenero] = useState('masculino');
    const [editEmail, setEditEmail] = useState('');
    const [editNumeroDeRegistro, setEditNumeroDeRegistro] = useState('');
    const [editRole, setEditRole] = useState('student');
    const [editGrupoDeTurma, setEditGrupoDeTurma] = useState('');
    const [editSenha, setEditSenha] = useState('');

    const fetchTurmas = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.get('/turma/getTurmas', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTurmas(response.data);
        } catch (error: any) {
            console.error('Failed to fetch turmas:', error.response ? error.response.data.message : error.message);
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.get('/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
        } catch (error: any) {
            console.error('Failed to fetch users:', error.response ? error.response.data.message : error.message);
        }
    };

    useEffect(() => {
        fetchTurmas();
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.post(
                '/users/',
                { nome, genero, email, numeroDeRegistro, role, grupoDeTurma, senha },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { data } = response;
            console.log('User registered successfully:', data);
            toast({
                title: "User registered successfully",
                description: `The user ${data.nome} has been registered.`,
            });
            setUsers([...users, data]); // Add new user to the list
            setNome(''); // Clear form fields
            setGenero('masculino');
            setEmail('');
            setNumeroDeRegistro('');
            setRole('student');
            setGrupoDeTurma('');
            setSenha('');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Registration failed:', error.response ? error.response.data.message : error.message);
            toast({
                title: "Registration failed",
                description: error.response ? error.response.data.message : error.message,
            });
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await api.put(
                `/users/${editUser._id}`,
                { nome: editNome, genero: editGenero, email: editEmail, numeroDeRegistro: editNumeroDeRegistro, role: editRole, grupoDeTurma: editGrupoDeTurma, senha: editSenha },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { data } = response;
            console.log('User updated successfully:', data);
            toast({
                title: "User updated successfully",
                description: `The user ${data.nome} has been updated.`,
            });

            // Fetch updated users list
            await fetchUsers();
            setEditUser(null); // Reset editUser state
            setEditNome(''); // Clear form fields
            setEditGenero('masculino');
            setEditEmail('');
            setEditNumeroDeRegistro('');
            setEditRole('student');
            setEditGrupoDeTurma('');
            setEditSenha('');
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Update failed:', error.response ? error.response.data.message : error.message);
            toast({
                title: "Update failed",
                description: error.response ? error.response.data.message : error.message,
            });
        }
    };

    const handleDelete = async (userId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            await api.delete(`/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast({
                title: "User deleted successfully",
            });
            setUsers(users.filter(user => user._id !== userId));
            setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
        } catch (error: any) {
            console.error('Delete failed:', error.response ? error.response.data.message : error.message);
            toast({
                title: "Delete failed",
                description: error.response ? error.response.data.message : error.message,
            });
        }
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setEditNome(user.nome);
        setEditGenero(user.genero);
        setEditEmail(user.email);
        setEditNumeroDeRegistro(user.numeroDeRegistro);
        setEditRole(user.role);
        setEditGrupoDeTurma(user.grupoDeTurma._id);
        setEditSenha('');
    };

    useEffect(() => {
        const filtered = users.filter(user => user.nome && user.nome.toLowerCase().includes(filter.toLowerCase()));
        setFilteredUsers(filtered);
    }, [filter, users]);

    return (
        <>
            <Link href="/dashboard" legacyBehavior passHref >
                <span className="absolute top-4 left-4 flex items-center gap-1"> <FaArrowLeft /> Voltar</span>
            </Link>
            <h1 className='text-4xl flex justify-center pb-3'>Gerenciar Alunos</h1>
            <Tabs defaultValue="register" className="w-full">
                <TabsList className="flex w-full justify-center">
                    <TabsTrigger value="register" className="flex-1 text-center">Registrar Usuário</TabsTrigger>
                    <TabsTrigger value="search" className="flex-1 text-center">Pesquisar Usuários</TabsTrigger>
                </TabsList>
                <TabsContent value="register" className="p-6">
                    <Card>
                        <CardHeader>Registrar Aluno</CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nome" className="text-right">
                                        Nome
                                    </Label>
                                    <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="genero" className="text-right">
                                        Gênero
                                    </Label>
                                    <Select value={genero} onValueChange={(value) => setGenero(value)} required>
                                        <SelectTrigger className="w-full col-span-3">
                                            <SelectValue placeholder="Selecione o gênero" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="masculino">Masculino</SelectItem>
                                            <SelectItem value="feminino">Feminino</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="numeroDeRegistro" className="text-right">
                                        Número de Registro
                                    </Label>
                                    <Input id="numeroDeRegistro" value={numeroDeRegistro} onChange={(e) => setNumeroDeRegistro(e.target.value)} className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">
                                        Função
                                    </Label>
                                    <Select value={role} onValueChange={(value) => setRole(value)} required>
                                        <SelectTrigger className="w-full col-span-3">
                                            <SelectValue placeholder="Selecione a função" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Estudante</SelectItem>
                                            <SelectItem value="teacher">Professor</SelectItem>
                                            <SelectItem value="admin">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="grupoDeTurma" className="text-right">
                                        Turma
                                    </Label>
                                    <Select value={grupoDeTurma} onValueChange={(value) => setGrupoDeTurma(value)} required>
                                        <SelectTrigger className="w-full col-span-3">
                                            <SelectValue placeholder="Selecione a turma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {turmas.map((turma) => (
                                                <SelectItem key={turma._id} value={turma._id}>{turma.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="senha" className="text-right">
                                        Senha
                                    </Label>
                                    <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="col-span-3" required />
                                </div>
                                <Button type="submit" className="mt-4">Registrar</Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="search" className="p-6">
                    <Card>
                        <CardHeader>Filtrar, Deletar e Editar Alunos</CardHeader>
                        <CardContent>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Filtrar por nome"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                                <div className="mt-4 max-h-96 overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                        {filteredUsers.map((user) => (
                                            <Card key={user._id}>
                                                <CardHeader>
                                                    <CardTitle>{user.nome}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p>Email: {user.email}</p>
                                                    <p>Gênero: {user.genero}</p>
                                                    <p>Registro: {user.numeroDeRegistro}</p>
                                                    <p>Função: {user.role}</p>
                                                    <p>Turma: {user.grupoDeTurma?.nome}</p>
                                                </CardContent>
                                                <CardFooter className="flex justify-between">
                                                    <Button onClick={() => openEditModal(user)}>Editar</Button>
                                                    <Button variant="destructive" onClick={() => handleDelete(user._id)}>Excluir</Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </TabsContent>
            </Tabs>
            {editUser && (
                <Dialog open={Boolean(editUser)} onOpenChange={() => setEditUser(null)}>
                    <DialogContent className="sm:max-w-[800px] w-full">
                        <DialogHeader>
                            <DialogTitle>Editar Usuário</DialogTitle>
                            <DialogDescription>
                                Edite as informações do usuário abaixo.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editNome" className="text-right">
                                    Nome
                                </Label>
                                <Input id="editNome" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editGenero" className="text-right">
                                    Gênero
                                </Label>
                                <Select value={editGenero} onValueChange={(value) => setEditGenero(value)} required>
                                    <SelectTrigger className="w-full col-span-3">
                                        <SelectValue placeholder="Selecione o gênero" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="masculino">Masculino</SelectItem>
                                        <SelectItem value="feminino">Feminino</SelectItem>
                                        <SelectItem value="outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editEmail" className="text-right">
                                    Email
                                </Label>
                                <Input id="editEmail" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editNumeroDeRegistro" className="text-right">
                                    Número de Registro
                                </Label>
                                <Input id="editNumeroDeRegistro" value={editNumeroDeRegistro} onChange={(e) => setEditNumeroDeRegistro(e.target.value)} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editRole" className="text-right">
                                    Função
                                </Label>
                                <Select value={editRole} onValueChange={(value) => setEditRole(value)} required>
                                    <SelectTrigger className="w-full col-span-3">
                                        <SelectValue placeholder="Selecione a função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Estudante</SelectItem>
                                        <SelectItem value="teacher">Professor</SelectItem>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editGrupoDeTurma" className="text-right">
                                    Turma
                                </Label>
                                <Select value={editGrupoDeTurma} onValueChange={(value) => setEditGrupoDeTurma(value)} required>
                                    <SelectTrigger className="w-full col-span-3">
                                        <SelectValue placeholder="Selecione a turma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {turmas.map((turma) => (
                                            <SelectItem key={turma._id} value={turma._id}>{turma.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="editSenha" className="text-right">
                                    Senha
                                </Label>
                                <Input id="editSenha" type="password" value={editSenha} onChange={(e) => setEditSenha(e.target.value)} className="col-span-3" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Salvar</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default AbaUser;
