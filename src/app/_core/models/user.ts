export abstract class User {
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public profileImage: string,
        public id?: number
    ) {}
}

export class NaturalPerson extends User {
    constructor(
        name: string,
        email: string,
        password: string,
        public cpf: string,
        profileImage: string
    ) {
        super(name, email, password, profileImage);
    }
}

export class LegalEntity extends User {
    constructor(
        name: string,
        email: string,
        password: string,
        public cnpj: string,
        profileImage: string
    ) {
        super(name, email, password, profileImage);
    }
}

export interface RegisterFormData {
    type: 'natural' | 'legal',
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    cpf?: string,
    cnpj?: string
}
