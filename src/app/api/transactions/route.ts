import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'transactions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de transações:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar transações' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'transactions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const newTransaction = await request.json();
    
    // Gerar novo ID
    const newId = data.currentId;
    data.currentId += 1;
    
    // Adicionar nova transação
    const transaction = {
      id: newId,
      ...newTransaction
    };
    
    data.transactions.push(transaction);
    
    // Salvar no arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
}
