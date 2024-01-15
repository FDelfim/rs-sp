import GoogleProvider from 'next-auth/providers/google'
import CredentioalsProvider from 'next-auth/providers/credentials'
import { FirestoreAdapter  } from '@next-auth/firebase-adapter'
import { cert } from "firebase-admin/app"
import { db } from './lib/firebase'
import { getDoc, doc } from 'firebase/firestore'

export const options = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
    adapter: FirestoreAdapter ({
        credential: cert({
          projectId: 'rs-sp-master',
          clientEmail: 'firebase-adminsdk-bcyzl@rs-sp-master.iam.gserviceaccount.com',
          privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQSDL8pFb2qLv6\nKKUgbD6JxK6yiH/kSOFo9drZMcF4528z9GMb3say/pajUeJOuwTSiKHEhNtO/MWR\nUtVmPCBPE00Aji0cICqHOWPcIVKwiFMKuvi/JkmvNIfmbYcquancIL28xm7N+11A\nkaV5wrrSP6IrEKFDs3YUPSReNzKAclAjAoW+qRVdGZMdLiebrDivrZHy7MR2BPlP\nbnNGLTZ0RS4OJ0UdxA8r2f/syzVlS2Hx/NaCOzXbbr69c9WPxlqTKpxfD+P7zJnC\n+yWjNxiJ4jx/5iaA4P3Ai6ilO40b6qRdK8dMT5s/4aY87rY82PX8mmFKq+i8KYYI\niVW6ppnnAgMBAAECggEAHoe+xY63Wp+gMkqb7dVAE4S7kNr2WDmgpPiI1FZ5RCY0\nhDqZ/n9Yw+sSnK0Hjb/XNJ8niz1oQjtGIIeyVTKSD9VF78NndFx4r2qnqyBNVSge\neA+xH5/WpDKAizPZ4NbnQaeg+Fdj7ZifcjQHPAJhzSjbthFRejGHqO7PcmoH4pDb\nI/8PuGFOmhlLC+vajauJNCq8ACKN3V+ERsAVwyMrzNJsPfHa8lxYmiUN/ZytuTAO\ni+Yo/Kpj3w/EzkQlAOA8+L3Pu6TX9E/zviRu9LphB3C5bJ0EBH6GNhTYGAQ05ORX\nfol4rRj0lLzoLToPPAFhNnX1f0AI1Sh3tEd5D5XtfQKBgQD7JuJPV8EzUgFvY3+1\n9QI4yFDaDjGqO33Rx2XEuks0DvlROYgVmA4VPClRlVbd9CRi7IH+Wpivc0i2QJuP\n4I9hGt+2ccCGqkOoFcFaP8XmzE5Pfn3QWgYc3MQdA8dxpdfZZGeNqMOI8TFU/dsd\npKhxW/p0gqbS0IERDjJiuZEzLQKBgQDUTXcicZdWhugWlPLufGI2KxP2j6rA54VI\n9+HC3C1LG0ztRrqHrvtUkYlRQOe8B+H/JHrjKlRj6VZdLRLP4ja5s0WRsR8/cPTG\nt3DZEXZKaJ2CdI7QS6RuC3HJFgvtRsrfCphovQvfoT8aXCg/8jSdvBTfn+mwSndB\nAanN11a94wKBgDZZNcQBs3dNma3nFC3l9TMgdg6Z37l84j9RLP6jab68NsuS7ZXu\nr618tVxIOuIRAQa/M2o9ZKkjA2sdFAzQhXZ4AE1U1FrP4ZAwFQVYo5TMRW4Ca2t4\n77WzOGUm+jPntYv/pEENcjLiLtC7ln0VsrXFN6+azkr0f9mW/uRKT9eJAoGAHpLh\nW0Z8gut+tPHSYmHrSt29TD64Wnt9CFsaWhOXOj++PlV3O18Jts4WtmrgdIW2GCZK\nxDguWw0ZcOWy1dlABFI67JZTZ7F+rrdwOvJ21JRoSoc6oeiiz246frj8ErmlMaW2\n+S5wbU4tZkBrU3ov9Z9GakX/Q3IV5ni02X3vcf0CgYA/7H+VIpHQRNZmLOrLcSIP\n2CbTSktxyt5ve00vNECoPe6DnorRHR0/h/nSxU6b0cMC6TA/Qelnr9xusikuhE00\n/6Fj1IoAJ2BbgFhwv5Wl2wLVTqKePkQqm6T+blRpiZE3gUHjeVq6cJGw1Whwpxhf\n+lfWhnn4tIotCKm4AsuGAA==\n-----END PRIVATE KEY-----\n',
        })
    }),
    callbacks: {
      async jwt({ token, user }) {
        if(token){
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
          session.user.userId = token.sub;
          session.user.data = token.data;
        } 
        return session;
      },
    },
    session: { strategy: "jwt" }
}