import { collection, doc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const usersCollection = collection(db, 'users');

export default async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({ error: 'ID parameter missing' });
            return;
        }
        const idStr = id.toString();
        const userDocRef = doc(usersCollection, idStr);
        const answersCollectionRef = collection(userDocRef, 'answers');

        const answersQuery = query(answersCollectionRef, orderBy('created_at', 'desc'), limit(1));

        const answersQuerySnapshot = await getDocs(answersQuery);

        if (answersQuerySnapshot.empty) {
            res.status(404).json({ error: 'Answers not found' });
        } else {
            const answers = answersQuerySnapshot.docs[0].data();

            res.status(200).json({ answers });
        }
    } catch (error) {
        console.error('Erro na API user-data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
