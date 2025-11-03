import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'transactions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const transactionId = parseInt(params.id);
    const updatedData = await request.json();
    
    const transactionIndex = data.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }
    
    data.transactions[transactionIndex] = {
      ...data.transactions[transactionIndex],
      ...updatedData,
      id: transactionId
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data.transactions[transactionIndex], { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'transactions.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    const transactionId = parseInt(params.id);
    
    const transactionIndex = data.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }
    
    const deletedTransaction = data.transactions[transactionIndex];
    data.transactions.splice(transactionIndex, 1);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(
      { success: true, message: 'Transação excluída com sucesso', transaction: deletedTransaction },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar transação' },
      { status: 500 }
    );
  }
}

