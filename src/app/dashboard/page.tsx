import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { SiGoogleclassroom } from "react-icons/si";
import { RiTeamLine } from "react-icons/ri";



export default function Dashboard() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <div className="fixed top-0 left-0 right-0 z-50 w-ful">
                <MainNav />
            </div>
            <div className="flex-grow flex items-center justify-center pt-16 w-full gap-5">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <CiUser />
                            Gerenciar Alunos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Registro, Edição e Exclusão de Alunos
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/gerenciar-alunos" legacyBehavior passHref >
                            <Button> Ir para Alunos</Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <SiGoogleclassroom />
                            Gerenciar Turmas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Registro e Edição de Turmas
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/gerenciar-turmas" legacyBehavior passHref >
                            <Button> Ir para Turmas</Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <RiTeamLine />
                            Gerenciar Sorteio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Realizar Sorteio
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/sorteio-times" legacyBehavior passHref >
                            <Button> Ir para Sorteio</Button>
                        </Link>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex gap-2">
                            <RiTeamLine />
                            Gerenciar Times
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Registro de Times
                    </CardContent>
                    <CardFooter>
                        <Link href="/dashboard/gerenciar-times" legacyBehavior passHref >
                            <Button> Ir para Times</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </main>
    );
}	