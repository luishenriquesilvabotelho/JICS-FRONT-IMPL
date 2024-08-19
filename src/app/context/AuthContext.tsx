'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { usePathname } from 'next/navigation';

interface User {
  _id: string;
  nome: string;
  email: string;
  grupoDeTurma: string;
  role: string;
  senha: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const lastActivityTimeRef = useRef(Date.now());
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Falha ao analisar o usuário do localStorage:', error);
        setUser(null);
      }
    }

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token || pathname === '/login') {
        return;
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const tokenExpiration = tokenPayload.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > tokenExpiration) {
        toast({
          title: "Sessão Expirada",
          description: "Sua sessão expirou. Você será deslogado.",
        });
        logout();
      }
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastActivityTimeRef.current;

      if (timeDiff > 1000 && pathname !== '/') {
        toast({
          title: "Inatividade",
          description: "Você ficou inativo por muito tempo. Você será deslogado.",
        });
        logout();
      }
    };

    const handleUserActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);
    const inactivityCheckInterval = setInterval(checkInactivity, 60000);

    return () => {
      clearInterval(tokenCheckInterval);
      clearInterval(inactivityCheckInterval);
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
    };
  }, [pathname]);

  const login = (userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    lastActivityTimeRef.current = Date.now();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso.",
    });
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
