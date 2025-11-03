"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    profileImage: string;
    cpf?: string;
    cnpj?: string;
}

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Verificar se há usuário no localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
                localStorage.removeItem('user');
                router.push('/login');
            }
        } else {
            // Se não há usuário, redirecionar para login
            router.push('/login');
        }
        
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '1.2rem'
            }}>
                Carregando...
            </div>
        );
    }

    if (!user) {
        return null; // Será redirecionado pelo useEffect
    }

    return <>{children}</>;
}
