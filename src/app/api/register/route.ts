import { NextResponse } from 'next/server';
import { getUserService } from '@/app/_core/container';
import { NaturalPerson, LegalEntity } from '@/app/_core/models/user';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, name, email, password, cpf, cnpj } = body;

        const randomProfileNumber = Math.floor(Math.random() * 6) + 1;
        const profileImage = `/profile-${randomProfileNumber}.png`;

        const userService = getUserService();
        
        const user = type === 'natural'
            ? new NaturalPerson(name, email, password, cpf, profileImage)
            : new LegalEntity(name, email, password, cnpj, profileImage);

        const userId = userService.save(user);
        
        return NextResponse.json({ 
            success: true, 
            userId,
            message: 'Usuário criado com sucesso!' 
        }, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Erro ao criar conta. Tente novamente.' 
        }, { status: 500 });
    }
}

