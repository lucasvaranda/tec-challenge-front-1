import fs from 'fs';
import path from 'path';
import { User } from '../models/user';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

export class UserRepository {
    private users: Map<number, User> = new Map();
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
                
                if (parsed.users && Array.isArray(parsed.users)) {
                    parsed.users.forEach((user: User) => {
                        if (user.id) {
                            this.users.set(user.id, user);
                        }
                    });
                }
                
                console.log(`Loaded ${this.users.size} users from file`);
            } else {
                this.saveToFile();
            }
        } catch (error) {
            console.error('Error loading users from file:', error);
        }
    }

    private saveToFile(): void {
        try {
            const data = {
                currentId: this.currentId,
                users: Array.from(this.users.values())
            };
            
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
            console.log('Users saved to file');
        } catch (error) {
            console.error('Error saving users to file:', error);
        }
    }
    
    save(user: User): number {
        const id = this.currentId++;
        this.users.set(id, { ...user, id });
        this.saveToFile();
        console.log(`User saved with ID: ${id}`);
        return id;
    }

    findById(id: number): User | undefined {        
        return this.users.get(id);
    }

    findAll(): User[] {
        return Array.from(this.users.values());
    }

    update(id: number, userData: User): void {
        const user = this.users.get(id);
        if(user) {
            this.users.set(id, { ...user, ...userData });
            this.saveToFile();
            console.log(`User ${id} updated`);
        }
    }

    delete(id: number): void {
        this.users.delete(id);
        this.saveToFile();
        console.log(`User ${id} deleted`);
    }

    findByEmail(email: string): User | undefined {
        return Array.from(this.users.values()).find(user => user.email === email);
    }
}
