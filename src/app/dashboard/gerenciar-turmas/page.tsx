'use client';

import React, { useState, useEffect } from 'react';
import api from '@/app/api/api';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaArrowLeft } from "react-icons/fa";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import Link from 'next/link';
import { SiGoogleclassroom } from "react-icons/si";

interface ClassGroup {
    _id: string;
    nome: string;
    nivel: string;
    curso: string;
    turno: string;
    anoAcademico: number;
}

const AbaTurmas: React.FC = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        nome: '',
        nivel: '',
        curso: '',
        turno: '',
        anoAcademico: new Date().getFullYear(),
    });
    const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGroup, setEditingGroup] = useState<ClassGroup | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            if (editingGroup) {
                // Atualizar grupo existente
                await api.put(`/turma/${editingGroup._id}`, formData, config);
                toast({
                    title: "Success",
                    description: "Grupo de classe atualizado com sucesso!",
                });
                setEditingGroup(null);
                setIsEditDialogOpen(false);
            } else {
                // Criar novo grupo
                await api.post('/turma/', formData, config);
                toast({
                    title: "Success",
                    description: "Grupo de classe registrado com sucesso!",
                });
            }

            // Atualizar a lista de grupos de classe
            const response = await api.get('/turma/', config);
            setClassGroups(response.data);
            setFormData({
                nome: '',
                nivel: '',
                curso: '',
                turno: '',
                anoAcademico: new Date().getFullYear(),
            });
        } catch (error: any) {
            console.error(error.response ? error.response.data.message : error.message);
            toast({
                title: "Error",
                description: error.response ? error.response.data.message : error.message,
            });
        }
    };

    const handleEdit = (group: ClassGroup) => {
        setEditingGroup(group);
        setFormData({
            nome: group.nome,
            nivel: group.nivel,
            curso: group.curso,
            turno: group.turno,
            anoAcademico: group.anoAcademico,
        });
        setIsEditDialogOpen(true);
    };

    const filteredClassGroups = classGroups.filter(group =>
        group.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Link href="/dashboard" legacyBehavior passHref >
                <span className="absolute top-4 left-4 flex items-center gap-1"> <FaArrowLeft /> Voltar</span>
            </Link>
            <h1 className='text-4xl flex justify-center pb-3'>Gerenciar Turmas</h1>
            <Tabs defaultValue="register" className="w-full">
                <TabsList className="flex w-full">
                    <TabsTrigger value="register" className="flex-1 text-center">Registrar Turma</TabsTrigger>
                    <TabsTrigger value="search" className="flex-1 text-center">Pesquisar Turmas</TabsTrigger>
                </TabsList>
                <TabsContent value="register"  className='w-[600px] h-[400px]'>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                Registrar Turma
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid gap-4 mt-3">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nome" className="text-right">Nome</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Nome"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nivel" className="text-right">Nível</Label>
                                    <Input
                                        id="nivel"
                                        name="nivel"
                                        value={formData.nivel}
                                        onChange={handleChange}
                                        placeholder="Nível"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="curso" className="text-right">Curso</Label>
                                    <Input
                                        id="curso"
                                        name="curso"
                                        value={formData.curso}
                                        onChange={handleChange}
                                        placeholder="Curso"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="turno" className="text-right">Turno</Label>
                                    <Input
                                        id="turno"
                                        name="turno"
                                        value={formData.turno}
                                        onChange={handleChange}
                                        placeholder="Turno"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="anoAcademico" className="text-right">Ano Acadêmico</Label>
                                    <Input
                                        id="anoAcademico"
                                        type="number"
                                        name="anoAcademico"
                                        value={formData.anoAcademico}
                                        onChange={handleChange}
                                        placeholder="Ano Acadêmico"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <CardFooter className="flex justify-end">
                                    <Button type="submit">Registrar</Button>
                                </CardFooter>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="search"  className='w-[600px] h-[400px]'>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                <SiGoogleclassroom />
                                Pesquisar Turmas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 mt-2">
                                <Input
                                    id="search"
                                    name="search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    placeholder="Digite o nome do grupo de classe"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="mt-4 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredClassGroups.length > 0 ? (
                                        filteredClassGroups.map(group => (
                                            <div key={group._id} className="border p-4 rounded-lg">
                                                <h2 className="text-lg font-bold">{group.nome}</h2>
                                                <p><strong>ID:</strong> {group._id}</p>
                                                <p><strong>Nível:</strong> {group.nivel}</p>
                                                <p><strong>Curso:</strong> {group.curso}</p>
                                                <p><strong>Turno:</strong> {group.turno}</p>
                                                <p><strong>Ano Acadêmico:</strong> {group.anoAcademico}</p>
                                                <Button
                                                    variant="outline"
                                                    className="mt-2"
                                                    onClick={() => handleEdit(group)}
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Nenhum grupo de classe encontrado.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Grupo de Classe</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nome" className="text-right">Nome</Label>
                            <Input
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Nome"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nivel" className="text-right">Nível</Label>
                            <Input
                                id="nivel"
                                name="nivel"
                                value={formData.nivel}
                                onChange={handleChange}
                                placeholder="Nível"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="curso" className="text-right">Curso</Label>
                            <Input
                                id="curso"
                                name="curso"
                                value={formData.curso}
                                onChange={handleChange}
                                placeholder="Curso"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="turno" className="text-right">Turno</Label>
                            <Input
                                id="turno"
                                name="turno"
                                value={formData.turno}
                                onChange={handleChange}
                                placeholder="Turno"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="anoAcademico" className="text-right">Ano Acadêmico</Label>
                            <Input
                                id="anoAcademico"
                                type="number"
                                name="anoAcademico"
                                value={formData.anoAcademico}
                                onChange={handleChange}
                                placeholder="Ano Acadêmico"
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Salvar</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AbaTurmas;
