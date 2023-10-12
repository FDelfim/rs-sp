import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase'

const settingsCollection = collection(db, 'settings');

export default async (req, res) => {
    if(req.method === 'POST'){
        const { id, data } = JSON.parse(req.body);
        try {
            const docRef = doc(settingsCollection, id);
            await setDoc(docRef, data);
            res.status(200).json({ message: 'Escala ' + id + ' atualizada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }else if(req.method === 'GET'){
        const { id } = req.query;
        try {
            const docRef = doc(settingsCollection, id);
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                res.status(200).json(docSnap.data());
            } else {
                res.status(404).json({ error: 'Escala não encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}