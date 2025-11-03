import fs from 'fs';
import path from 'path';
import { Transaction } from '../models/transaction';

const DATA_FILE = path.join(process.cwd(), 'data', 'transactions.json');

export class TransactionRepository {
    private transactions: Map<number, Transaction> = new Map();
    private currentId: number = 1;

    constructor() {
        this.loadFromFile();
    }

    private loadFromFile(): void {
        try {
            const dataDir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf-8');
                const parsed = JSON.parse(data);
                
                this.currentId = parsed.currentId || 1;
                
                if (parsed.transactions && Array.isArray(parsed.transactions)) {
                    parsed.transactions.forEach((transaction: Transaction) => {
                        if (transaction.id) {
                            this.transactions.set(transaction.id, transaction);
                        }
                    });
                }
                
                console.log(`Loaded ${this.transactions.size} transactions from file`);
            } else {
                this.saveToFile();
            }
        } catch (error) {
            console.error('Error loading transactions from file:', error);
        }
    }

    private saveToFile(): void {
        try {
            const data = {
                currentId: this.currentId,
                transactions: Array.from(this.transactions.values())
            };
            
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
            console.log('Transactions saved to file');
        } catch (error) {
            console.error('Error saving transactions to file:', error);
        }
    }

    save(transaction: Transaction): number {
        const id = this.currentId++;
        this.transactions.set(id, { ...transaction, id });
        this.saveToFile();
        console.log(`Transaction saved with ID: ${id}`);
        return id;
    }

    findById(id: number): Transaction | undefined {        
        return this.transactions.get(id);
    }

    findAll(): Transaction[] {
        return Array.from(this.transactions.values());
    }

    update(id: number, transactionData: Transaction): void {
        const transaction = this.transactions.get(id);
        if(transaction) {
            this.transactions.set(id, { ...transaction, ...transactionData });
            this.saveToFile();
            console.log(`Transaction ${id} updated`);
        }
    }

    delete(id: number): void {
        this.transactions.delete(id);
        this.saveToFile();
        console.log(`Transaction ${id} deleted`);
    }
}
