import NextAuth, { DefaultSession } from 'next-auth';


console.log('Definição de tipos NextAuth carregada!');

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            userInfo: any[];
        } & DefaultSession['user'];
    }
}