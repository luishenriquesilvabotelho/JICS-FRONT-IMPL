"use client"
import { useAuth } from "@/app/context/AuthContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserNav() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Avatar>
        <AvatarImage src="https://github.com/luisinhu.png" />
        <AvatarFallback>LN</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>{user?.nome}</DropdownMenuLabel>
      <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/configuracao" legacyBehavior passHref>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
        </Link>
        <Link href="/perfil" legacyBehavior passHref>
          <DropdownMenuItem>Meu Perfil</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>
          Sair
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}
