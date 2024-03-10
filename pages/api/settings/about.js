import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'
import { getToken } from "next-auth/jwt"

const settingsCollection = collection(db, 'settings');

export default async (req, res) => {
    if(req.method === 'POST'){
        const token = await getToken({ req })
        if(token.data.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        const { data } = JSON.parse(req.body);
        try {
            const docRef = doc(settingsCollection, 'about');
            await setDoc(docRef, {text: data});
            res.status(200).json({ message: 'Sobre atualizado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }else if(req.method === 'GET'){
        try {
            const docRef = doc(settingsCollection, 'about');
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                res.status(200).json(docSnap.data());
            } else {
                res.status(404).json({ error: 'Dados não encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}