import { UserRepository } from "./repositories/user.repository";
import { TransactionRepository } from "./repositories/transaction.repository";
import { UserService } from "./services/user.service";
import { TransactionService } from "./services/transaction.service";

export class Container {
    private services = new Map<string, any>();

    register<T>(name: string, implementation: new (...args: any[]) => T): void {
        this.services.set(name, implementation);
    }

    resolve<T>(name: string): T {
        const implementation = this.services.get(name);
        if (!implementation) {
            throw new Error(`Service not found: ${name}`);
        }
        return new implementation();
    }
}

export const container = new Container();

container.register('UserRepository', UserRepository);
container.register('TransactionRepository', TransactionRepository);
container.register('UserService', UserService);
container.register('TransactionService', TransactionService);

const userRepository = new UserRepository();
const transactionRepository = new TransactionRepository();

export function getUserService(): UserService {
    const transactionService = getTransactionService();
    return new UserService(userRepository, transactionService);
}

export function getTransactionService(): TransactionService {
    return new TransactionService(transactionRepository);
}
