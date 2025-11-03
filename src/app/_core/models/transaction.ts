export abstract class Transaction {
    constructor(
        public value: number,
        public user_id: number,
        public transaction_type: 'entry' | 'exit',
        public bank: string,
        public id?: number
    ) {}
}

export class Pix extends Transaction {
    constructor(
        value: number,
        user_id: number,
        transaction_type: 'entry' | 'exit',
        bank: string,
        public key: string
    ) {
        super(value, user_id, transaction_type, bank)
    }
}

export class Ted extends Transaction {
    constructor(
        value: number,
        user_id: number,
        transaction_type: 'entry' | 'exit',
        bank: string,
        public sent_by: string,
        public received_by: string
    ) {
        super(value, user_id, transaction_type, bank)
    }
}

export class Billet extends Transaction {
    constructor(
        value: number,
        user_id: number,
        transaction_type: 'entry' | 'exit',
        bank: string,
        public code: string
    ) {
        super(value, user_id, transaction_type, bank);
    }
}
