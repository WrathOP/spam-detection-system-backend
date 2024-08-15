export interface Signup {
    username: string | null;
    name: string;
    password: string;
    phone_number: number;
    email: string | null;
}

export interface Login {
    phone_number: number;
    password: string;
}
