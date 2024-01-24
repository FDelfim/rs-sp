import GoogleProvider from 'next-auth/providers/google'
import CredentioalsProvider from 'next-auth/providers/credentials'
import { FirestoreAdapter  } from '@next-auth/firebase-adapter'
import { cert } from "firebase-admin/app"
import { db } from './lib/firebase'
import { getDoc, doc } from 'firebase/firestore'

export const options = {
    pages:{
      signIn: '/',
    },
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    adapter: FirestoreAdapter ({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY,
        })
    }),
    callbacks: {
      async jwt({ token, user, account, trigger }) {
        if((account && user) || trigger === 'update'){
          let docRef = doc(db, 'users', token.sub);
          let docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            token.data = docSnap.data();
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (session?.user){
          session.user = {...session.user, "userId": token.sub , ...token.data};
        } 
        return session;
      },
    },
    session: { strategy: "jwt" }
}