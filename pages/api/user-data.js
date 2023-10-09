import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'

const usersCollection = collection(db, 'users');

export default async (req, res) => {
    try {
        const docRef = doc(usersCollection, req.query.id);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ user: userDoc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário!' });
    }
}
