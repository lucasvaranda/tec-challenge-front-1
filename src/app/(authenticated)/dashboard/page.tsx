"use client";

import { useEffect, useState } from 'react';
import { FaSmileWink, FaWallet, FaEye, FaEyeSlash, FaBell } from "react-icons/fa";
import styles from './page.module.scss';

interface User {
    id: number;
    name: string;
    email: string;
    profileImage: string;
    cpf?: string;
    cnpj?: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [showBalance, setShowBalance] = useState<boolean>(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);

                // Carregar saldo do usuário
                fetch('/api/transactions')
                    .then(response => response.json())
                    .then(data => {
                        const userTransactions = data.transactions.filter((t: any) => t.user_id === userData.id);
                        
                        const calculatedBalance = userTransactions.reduce((acc: number, transaction: any) => {
                            return transaction.transaction_type === 'entry' 
                                ? acc + transaction.value 
                                : acc - transaction.value;
                        }, 0);
                        setBalance(calculatedBalance);
                    })
                    .catch(error => {
                        console.error('Erro ao carregar transações:', error);
                    });
            } catch (error) {
                console.error('Erro ao parsear dados do usuário:', error);
            }
        }
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className={styles.dashboard}>
            <div className={`${styles.card} ${styles.orange}`}>
                <div className={styles.iconCard}>
                    <div className={styles.iconWrapper}>
                        <FaSmileWink size={60} />
                    </div>
                    <div>
                        <p className={styles.title}>Olá, {user?.name || 'Usuário'}!</p>
                        <p className={styles.subtitle}>Seja bem-vindo(a) ao Pós Bank!</p>
                    </div>
                </div>
            </div>

            <div className={`${styles.card} ${styles.green}`}>
                <div className={styles.iconCard}>
                    <div className={styles.iconWrapper}>
                        <FaWallet size={60} />
                    </div>
                    <div className={styles.saldoContent}>
                        <div>
                            <p className={styles.title}>Saldo Atual</p>
                            <p className={styles.subtitle}>Conta Corrente</p>
                        </div>
                        <div className={styles.saldoRight}>
                            {showBalance && (
                                <p className={styles.balanceText}>
                                    {formatCurrency(balance)}
                                </p>
                            )}
                            <button 
                                className={styles.toggleButton}
                                onClick={() => setShowBalance(!showBalance)}
                            >
                                {showBalance ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card de Comunicação */}
            <div className={`${styles.card} ${styles.white} ${styles.extratoCard}`}>
                <div className={styles.iconCard}>
                    <div className={styles.iconWrapper}>
                        <FaBell size={40} />
                    </div>
                    <div>
                        <p className={styles.title}>Comunicação</p>
                        <p className={styles.subtitle}>Mensagens importantes</p>
                    </div>
                </div>
                <div className={styles.transactionsList}>
                    <div className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                                💳 Sua fatura fechou em R$ 1.250,00
                            </div>
                            <div className={styles.transactionDate}>
                                Hoje
                            </div>
                        </div>
                    </div>
                    <div className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                                💰 Você tem direito a empréstimo de até R$ 15.000,00
                            </div>
                            <div className={styles.transactionDate}>
                                Ontem
                            </div>
                        </div>
                    </div>
                    <div className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                                📈 Seu limite de crédito foi aumentado para R$ 8.000,00
                            </div>
                            <div className={styles.transactionDate}>
                                2 dias atrás
                            </div>
                        </div>
                    </div>
                    <div className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                                🏦 PIX gratuito ilimitado para sua conta
                            </div>
                            <div className={styles.transactionDate}>
                                3 dias atrás
                            </div>
                        </div>
                    </div>
                    <div className={styles.transactionItem}>
                        <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                                💎 Você foi selecionado para o programa VIP
                            </div>
                            <div className={styles.transactionDate}>
                                1 semana atrás
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}