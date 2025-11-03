"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import styles from './TransactionDetail.module.scss';

interface Transaction {
    id: number;
    value: number;
    user_id: number;
    transaction_type: 'entry' | 'exit';
    bank: string;
    created_at: string;
    key?: string;
    sent_by?: string;
    received_by?: string;
    code?: string;
}

const getTransactionType = (transaction: Transaction): string => {
    if (transaction.key) return 'PIX';
    if (transaction.sent_by && transaction.received_by) return 'TED';
    if (transaction.code) return 'Boleto';
    return 'Transação';
};

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const transactionId = params.slug;
    
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Record<string, any>>({});

    useEffect(() => {
        if (transactionId) {
            fetch('/api/transactions')
                .then(response => response.json())
                .then(data => {
                    const foundTransaction = data.transactions.find((t: Transaction) => t.id === parseInt(transactionId as string));
                    if (foundTransaction) {
                        setTransaction(foundTransaction);
                        setFormData(foundTransaction);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Erro ao carregar transação:', error);
                    setLoading(false);
                });
        }
    }, [transactionId]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const maskCurrency = (value: string | number): string => {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        }
        
        const numbers = value.replace(/\D/g, '');
        
        if (!numbers) return '';
        
        const amount = Number(numbers) / 100;
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const unmaskCurrency = (value: string): number => {
        const numbers = value.replace(/\D/g, '');
        
        if (!numbers) return 0;
        
        return Number(numbers) / 100;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'value') {
            const maskedValue = maskCurrency(value);
            setFormData(prev => ({
                ...prev,
                [name]: maskedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        try {
            const numericValue = unmaskCurrency(String(formData.value || 0));
            const { id, ...updatedData } = formData;
            updatedData.value = numericValue;
            
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            
            if (response.ok) {
                const updatedTransaction = await response.json();
                setTransaction(updatedTransaction);
                setIsEditing(false);
                
                if (window.location.pathname.includes('/transactions/')) {
                    window.location.reload();
                }
            } else {
                alert('Erro ao salvar transação');
            }
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            alert('Erro ao salvar transação');
        }
    };

    const handleCancel = () => {
        setFormData(transaction || {});
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <p>Carregando transação...</p>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>Transação não encontrada</p>
                    <button 
                        className="btn-standard btn-secondary"
                        onClick={() => router.push('/transactions')}
                    >
                        <FaArrowLeft size={16} />
                        Voltar para Transações
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button 
                    className="btn-standard btn-secondary"
                    onClick={() => router.push('/transactions')}
                >
                    <FaArrowLeft size={16} />
                    Voltar
                </button>
                
                <div className={styles.titleSection}>
                    <h1>{getTransactionType(transaction)}</h1>
                    <div className={styles.transactionType}>
                        {transaction.transaction_type === 'entry' ? 'Entrada' : 'Saída'}
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    {!isEditing ? (
                        <button 
                            className="btn-standard btn-primary"
                            onClick={() => {
                                if (transaction) {
                                    setFormData({
                                        ...transaction,
                                        value: maskCurrency(transaction.value)
                                    });
                                }
                                setIsEditing(true);
                            }}
                        >
                            <FaEdit size={16} />
                            Editar
                        </button>
                    ) : (
                        <div className={styles.editActions}>
                            <button 
                                className="btn-standard btn-secondary"
                                onClick={handleCancel}
                            >
                                <FaTimes size={16} />
                                Cancelar
                            </button>
                            <button 
                                className="btn-standard btn-primary"
                                onClick={handleSave}
                            >
                                <FaSave size={16} />
                                Salvar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainInfo}>
                    <div className={styles.valueSection}>
                        <h2>Valor</h2>
                        {isEditing ? (
                            <input
                                type="text"
                                name="value"
                                value={formData.value || ''}
                                onChange={handleInputChange}
                                className={styles.valueInput}
                                placeholder="R$ 0,00"
                            />
                        ) : (
                            <div className={`${styles.value} ${transaction.transaction_type === 'entry' ? styles.positive : styles.negative}`}>
                                {transaction.transaction_type === 'entry' ? '+' : '-'}
                                {formatCurrency(transaction.value)}
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h3>Detalhes</h3>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <label>Tipo de Transação</label>
                            {isEditing ? (
                                <select
                                    name="transaction_type"
                                    value={formData.transaction_type || ''}
                                    onChange={handleInputChange}
                                    className={styles.selectInput}
                                >
                                    <option value="entry">Entrada</option>
                                    <option value="exit">Saída</option>
                                </select>
                            ) : (
                                <span>{transaction.transaction_type === 'entry' ? 'Entrada' : 'Saída'}</span>
                            )}
                        </div>
                        <div className={styles.detailItem}>
                            <label>Data</label>
                            {isEditing ? (
                                <input
                                    type="datetime-local"
                                    name="created_at"
                                    value={formData.created_at ? new Date(formData.created_at).toISOString().slice(0, 16) : ''}
                                    onChange={handleInputChange}
                                    className={styles.textInput}
                                />
                            ) : (
                                <span>{formatDate(transaction.created_at)}</span>
                            )}
                        </div>

                        <div className={styles.detailItem}>
                            <label>Banco</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="bank"
                                    value={formData.bank || ''}
                                    onChange={handleInputChange}
                                    className={styles.textInput}
                                />
                            ) : (
                                <span>{transaction.bank}</span>
                            )}
                        </div>

                        {transaction.key && (
                            <div className={styles.detailItem}>
                                <label>Chave PIX</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="key"
                                        value={formData.key || ''}
                                        onChange={handleInputChange}
                                        className={styles.textInput}
                                    />
                                ) : (
                                    <span>{transaction.key}</span>
                                )}
                            </div>
                        )}

                        {transaction.sent_by && (
                            <div className={styles.detailItem}>
                                <label>Enviado por</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="sent_by"
                                        value={formData.sent_by || ''}
                                        onChange={handleInputChange}
                                        className={styles.textInput}
                                    />
                                ) : (
                                    <span>{transaction.sent_by}</span>
                                )}
                            </div>
                        )}

                        {transaction.received_by && (
                            <div className={styles.detailItem}>
                                <label>Recebido por</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="received_by"
                                        value={formData.received_by || ''}
                                        onChange={handleInputChange}
                                        className={styles.textInput}
                                    />
                                ) : (
                                    <span>{transaction.received_by}</span>
                                )}
                            </div>
                        )}

                        {transaction.code && (
                            <div className={styles.detailItem}>
                                <label>Código do Boleto</label>
                                {isEditing ? (
                                    <textarea
                                        name="code"
                                        value={formData.code || ''}
                                        onChange={handleInputChange}
                                        className={styles.textareaInput}
                                        rows={3}
                                    />
                                ) : (
                                    <span className={styles.code}>{transaction.code}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
