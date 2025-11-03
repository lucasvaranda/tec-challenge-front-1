"use client";

import { useEffect, useState } from 'react';
import TransactionsList from '../../_components/TransactionsList/TransactionsList';
import Loading from './loading';

interface Transaction {
    id: number;
    value: number;
    user_id: number;
    transaction_type: 'entry' | 'exit';
    bank: string;
    created_at: string;
    description: string;
    key?: string;
    sent_by?: string;
    received_by?: string;
    code?: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setLoading(false);
                return;
            }

            const userData = JSON.parse(storedUser);
            const userId = userData?.id;

            if (!userId) {
                setLoading(false);
                return;
            }

            const response = await fetch('/api/transactions');
            const data = await response.json();
            const userTransactions = data.transactions
                .filter((t: Transaction) => t.user_id === userId)
                .sort((a: Transaction, b: Transaction) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
            setTransactions(userTransactions);
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const handleTransactionCreated = () => {
        loadTransactions();
    };

    const handleTransactionDeleted = () => {
        loadTransactions();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <TransactionsList 
            transactions={transactions} 
            onTransactionCreated={handleTransactionCreated}
            onTransactionDeleted={handleTransactionDeleted}
        />
    );
}
