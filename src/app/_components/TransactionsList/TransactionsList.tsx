"use client";

import { useState } from 'react';
import { FaHistory, FaEye, FaEdit, FaTrash, FaPlus, FaMobileAlt, FaExchangeAlt, FaFileInvoice } from "react-icons/fa";
import { useSidebar } from '../../_context/SidebarContext';
import styles from './TransactionsList.module.scss';

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

interface TransactionsListProps {
    transactions: Transaction[];
    onTransactionCreated?: () => void;
    onTransactionDeleted?: () => void;
}

export default function TransactionsList({ transactions, onTransactionCreated, onTransactionDeleted }: TransactionsListProps) {
    const { closeSidebar } = useSidebar();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [formData, setFormData] = useState({
        value: '',
        transaction_type: 'entry' as 'entry' | 'exit',
        bank: 'Pós Bank',
        transaction_method: 'pix' as 'pix' | 'ted' | 'billet',
        key: '',
        sent_by: '',
        received_by: '',
        code: ''
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const maskCurrency = (value: string): string => {
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
            year: 'numeric'
        });
    };

    const getTransactionTitle = (transaction: Transaction) => {
        if (transaction.key) return 'PIX';
        if (transaction.sent_by && transaction.received_by) return 'TED';
        if (transaction.code) return 'Boleto';
        return 'Transação';
    };

    const getTransactionIcon = (transaction: Transaction) => {
        if (transaction.key) return <FaMobileAlt />;
        if (transaction.sent_by && transaction.received_by) return <FaExchangeAlt />;
        if (transaction.code) return <FaFileInvoice />;
        return <FaHistory />;
    };

    const handleView = (transaction: Transaction) => {
        if (typeof window !== 'undefined' && window.innerWidth <= 940) {
            closeSidebar();
            requestAnimationFrame(() => {
                window.location.href = `/transactions/${transaction.id}`;
            });
        } else {
            window.location.href = `/transactions/${transaction.id}`;
        }
    };

    const handleDelete = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedTransaction) return;
        
        try {
            const response = await fetch(`/api/transactions/${selectedTransaction.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setShowDeleteModal(false);
                setSelectedTransaction(null);
                if (onTransactionDeleted) {
                    onTransactionDeleted();
                }
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Erro ao excluir transação');
            }
        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            alert('Erro ao excluir transação. Tente novamente.');
        }
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

    const handleCreateTransaction = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                alert('Usuário não encontrado. Por favor, faça login novamente.');
                return;
            }

            const userData = JSON.parse(storedUser);
            const userId = userData?.id;

            if (!userId) {
                alert('ID do usuário não encontrado. Por favor, faça login novamente.');
                return;
            }

            const numericValue = unmaskCurrency(formData.value);
            
            const transactionData = {
                ...formData,
                value: numericValue,
                user_id: userId,
                created_at: new Date().toISOString()
            };

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (response.ok) {
                setShowCreateModal(false);
                resetForm();
                if (onTransactionCreated) {
                    onTransactionCreated();
                }
            } else {
                console.error('Erro ao criar transação');
            }
        } catch (error) {
            console.error('Erro ao criar transação:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            value: '',
            transaction_type: 'entry',
            bank: 'Pós Bank',
            transaction_method: 'pix',
            key: '',
            sent_by: '',
            received_by: '',
            code: ''
        });
        setShowCreateModal(false);
    };

    return (
        <div className={styles.transactionsContainer}>
            <div className={styles.mainCard}>
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <div className={styles.iconWrapper}>
                            <FaHistory size={24} />
                        </div>
                        <div>
                            <h2 className={styles.title}>Transações</h2>
                            <p className={styles.subtitle}>Histórico completo</p>
                        </div>
                    </div>
                    <button 
                        className="btn-standard btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FaPlus size={16} />
                        Nova Transação
                    </button>
                </div>

                <div className={styles.transactionsList}>
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div key={transaction.id} className={styles.transactionItem}>
                            <div className={styles.transactionInfo}>
                                <div className={styles.transactionIcon}>
                                    {getTransactionIcon(transaction)}
                                </div>
                                <div className={styles.transactionDetails}>
                                    <div className={styles.transactionDescription}>
                                        {getTransactionTitle(transaction)}
                                    </div>
                                    <div className={styles.transactionDate}>
                                        {formatDate(transaction.created_at)}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.transactionActions}>
                                <div className={`${styles.transactionValue} ${
                                    transaction.transaction_type === 'entry' ? styles.positive : styles.negative
                                }`}>
                                    {transaction.transaction_type === 'entry' ? '+' : '-'}
                                    {formatCurrency(transaction.value)}
                                </div>
                                <div className={styles.actionButtons}>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => handleView(transaction)}
                                        title="Visualizar"
                                    >
                                        <FaEye size={14} />
                                    </button>
                                    <button 
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(transaction)}
                                        title="Deletar"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>Nenhuma transação encontrada</p>
                    </div>
                )}
                </div>
            </div>

            {/* Modal de Criação */}
            {showCreateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Nova Transação</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label>Tipo de Transação</label>
                                    <select
                                        name="transaction_type"
                                        value={formData.transaction_type}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                    >
                                        <option value="entry">Entrada</option>
                                        <option value="exit">Saída</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Método</label>
                                    <select
                                        name="transaction_method"
                                        value={formData.transaction_method}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                    >
                                        <option value="pix">PIX</option>
                                        <option value="ted">TED</option>
                                        <option value="billet">Boleto</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Valor</label>
                                    <input
                                        type="text"
                                        name="value"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        placeholder="R$ 0,00"
                                        required
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Banco</label>
                                    <input
                                        type="text"
                                        name="bank"
                                        value={formData.bank}
                                        onChange={handleInputChange}
                                        className={styles.formInput}
                                        required
                                    />
                                </div>

                                {formData.transaction_method === 'pix' && (
                                    <div className={styles.formGroup}>
                                        <label>Chave PIX</label>
                                        <input
                                            type="text"
                                            name="key"
                                            value={formData.key}
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                            placeholder="Ex: email@exemplo.com"
                                            required
                                        />
                                    </div>
                                )}

                                {formData.transaction_method === 'ted' && (
                                    <>
                                        <div className={styles.formGroup}>
                                            <label>Enviado por</label>
                                            <input
                                                type="text"
                                                name="sent_by"
                                                value={formData.sent_by}
                                                onChange={handleInputChange}
                                                className={styles.formInput}
                                                placeholder="Nome do remetente"
                                                required
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Recebido por</label>
                                            <input
                                                type="text"
                                                name="received_by"
                                                value={formData.received_by}
                                                onChange={handleInputChange}
                                                className={styles.formInput}
                                                placeholder="Nome do destinatário"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.transaction_method === 'billet' && (
                                    <div className={styles.formGroup}>
                                        <label>Código do Boleto</label>
                                        <textarea
                                            name="code"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            className={styles.formTextarea}
                                            rows={3}
                                            placeholder="Código de barras do boleto"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className="btn-standard btn-secondary"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-standard btn-primary"
                                onClick={handleCreateTransaction}
                            >
                                Criar Transação
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Delete */}
            {showDeleteModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Confirmar Exclusão</h3>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Tem certeza que deseja excluir esta transação?</p>
                            {selectedTransaction && (
                                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                    <p style={{ margin: '5px 0', fontWeight: '600' }}>
                                        {getTransactionTitle(selectedTransaction)}
                                    </p>
                                    <p style={{ margin: '5px 0', color: '#64748b' }}>
                                        {formatDate(selectedTransaction.created_at)}
                                    </p>
                                    <p style={{ margin: '5px 0', fontWeight: '600', color: selectedTransaction.transaction_type === 'entry' ? '#63a879' : '#ca5c5c' }}>
                                        {selectedTransaction.transaction_type === 'entry' ? '+' : '-'}
                                        {formatCurrency(selectedTransaction.value)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button 
                                className="btn-standard btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-standard btn-danger"
                                onClick={confirmDelete}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
