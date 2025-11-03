"use client";
import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import styles from './error.module.scss';

interface ErrorProps {
    error: Error & { digest?: string },
    reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("Erro no Dashboard: ", error);
    }, [error]);
    
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <FaExclamationTriangle size={60} />
            </div>
            
            <div className={styles.content}>
                <h1 className={styles.title}>Ops! Algo deu errado</h1>
                <p className={styles.message}>
                    {error.message || "Ocorreu um erro inesperado ao carregar o dashboard."}
                </p>
                {error.digest && (
                    <p className={styles.digest}>ID: {error.digest}</p>
                )}
            </div>
            
            <div className={styles.actions}>
                <button onClick={reset} className="btn-standard btn-primary">
                    Tentar novamente
                </button>
            </div>
        </div>
    )
}