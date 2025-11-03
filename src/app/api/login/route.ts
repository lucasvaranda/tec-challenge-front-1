import { NextResponse } from 'next/server';
import { getUserService } from '@/app/_core/container';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email e senha são obrigatórios' 
            }, { status: 400 });
        }

        const userService = getUserService();
        const user = userService.validateLogin(email, password);

        if (!user) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email ou senha incorretos' 
            }, { status: 401 });
        }

        const { password: _, ...userWithoutPassword } = user;
        
        return NextResponse.json({ 
            success: true, 
            user: userWithoutPassword,
            message: 'Login realizado com sucesso!' 
        }, { status: 200 });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Erro ao fazer login. Tente novamente.' 
        }, { status: 500 });
    }
}

