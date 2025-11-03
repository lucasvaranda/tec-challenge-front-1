import { User } from '../models/user';
import { UserRepository } from '../repositories/user.repository';
import { TransactionService } from './transaction.service';

export class UserService {
    constructor(
        private repository: UserRepository,
        private transactionService: TransactionService
    ) {}
    
    save(user: User): number {
        return this.repository.save(user);
    }

    getById(id: number): User | undefined {
        return this.repository.findById(id);
    }

    getAll(): User[] {
        return this.repository.findAll();
    }

    getUserWithBalance(id: number): (User & { balance: number }) | undefined {
        const user = this.repository.findById(id);
        
        if (!user) {
            return undefined;
        }

        const balance = this.transactionService.getUserBalance(id);
        
        return {
            ...user,
            balance
        };
    }

    update(id: number, user: User): void {
        this.repository.update(id, user);
    }

    delete(id: number): void {
        this.repository.delete(id);
    }

    findByEmail(email: string): User | undefined {
        return this.repository.findByEmail(email);
    }

    validateLogin(email: string, password: string): User | null {
        const user = this.repository.findByEmail(email);
        
        if (!user) {
            return null;
        }

        if (user.password !== password) {
            return null;
        }

        return user;
    }
}