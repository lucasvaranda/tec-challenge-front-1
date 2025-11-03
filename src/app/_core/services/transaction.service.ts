import { Transaction } from '../models/transaction';
import { TransactionRepository } from '../repositories/transaction.repository';

export class TransactionService {
    constructor(private repository: TransactionRepository) {}
    
    save(transaction: Transaction): number {
        return this.repository.save(transaction);
    }

    getById(id: number): Transaction | undefined {
        return this.repository.findById(id);
    }

    getAll(): Transaction[] {
        return this.repository.findAll();
    }

    getByUserId(user_id: number): Transaction[] {
        return this.repository.findAll().filter(t => t.user_id === user_id);
    }

    getUserBalance(user_id: number): number {
        const transactions = this.getByUserId(user_id);
        
        return transactions.reduce((balance, transaction) => {
            return transaction.transaction_type === 'entry'
                ? balance + transaction.value
                : balance - transaction.value;
        }, 0);
    }

    update(id: number, transaction: Transaction): void {
        this.repository.update(id, transaction);
    }

    delete(id: number): void {
        this.repository.delete(id);
    }
}