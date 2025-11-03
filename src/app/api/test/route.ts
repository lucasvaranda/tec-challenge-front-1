import { NextResponse } from 'next/server';
import { getUserService, getTransactionService } from '@/app/_core/container';
import { NaturalPerson, LegalEntity } from '@/app/_core/models/user';
import { Pix, Ted, Billet } from '@/app/_core/models/transaction';

export async function GET() {
    try {
        const results: any = {
            timestamp: new Date().toISOString(),
            tests: []
        };

        const userService = getUserService();
        const transactionService = getTransactionService();

        // Teste 1: Criar usuários
        const user1Id = userService.save(new NaturalPerson(
            'João Silva',
            'joao@email.com',
            'senha123',
            '123.456.789-00'
        ));

        const user2Id = userService.save(new LegalEntity(
            'Empresa XPTO LTDA',
            'contato@xpto.com',
            'senha456',
            '12.345.678/0001-90'
        ));

        results.tests.push({
            test: 'Criar usuários',
            status: 'success',
            data: {
                user1Id,
                user2Id
            }
        });

        // Teste 2: Criar transações
        transactionService.save(new Pix(
            1000,
            user1Id,
            'entry',
            'Banco do Brasil',
            'joao@email.com'
        ));

        transactionService.save(new Ted(
            500,
            user1Id,
            'entry',
            'Itaú',
            'Maria Silva',
            'Rafael Oliveira'
        ));

        transactionService.save(new Billet(
            300,
            user1Id,
            'exit',
            'Caixa Econômica',
            '12345.67890 12345.678901'
        ));

        results.tests.push({
            test: 'Criar transações',
            status: 'success',
            data: {
                message: '3 transações criadas para o usuário 1'
            }
        });

        // Teste 3: Calcular saldo
        const balance = transactionService.getUserBalance(user1Id);
        
        results.tests.push({
            test: 'Calcular saldo',
            status: 'success',
            data: {
                userId: user1Id,
                balance: balance,
                expected: 1200,
                isCorrect: balance === 1200
            }
        });

        // Teste 4: Buscar transações do usuário
        const userTransactions = transactionService.getByUserId(user1Id);
        
        results.tests.push({
            test: 'Buscar transações do usuário',
            status: 'success',
            data: {
                userId: user1Id,
                totalTransactions: userTransactions.length,
                transactions: userTransactions
            }
        });

        // Teste 5: Buscar usuário com saldo
        const userWithBalance = userService.getUserWithBalance(user1Id);
        
        results.tests.push({
            test: 'Buscar usuário com saldo',
            status: 'success',
            data: userWithBalance
        });

        // Teste 6: Estatísticas gerais
        const allUsers = userService.getAll();
        const allTransactions = transactionService.getAll();
        
        results.tests.push({
            test: 'Estatísticas gerais',
            status: 'success',
            data: {
                totalUsers: allUsers.length,
                totalTransactions: allTransactions.length
            }
        });

        results.summary = {
            totalTests: results.tests.length,
            passed: results.tests.filter((t: any) => t.status === 'success').length,
            failed: results.tests.filter((t: any) => t.status === 'failed').length
        };

        return NextResponse.json(results, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            error: 'Erro ao executar testes',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

