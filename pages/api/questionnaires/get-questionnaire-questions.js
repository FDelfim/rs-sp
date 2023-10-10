import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const questionnaireCollection = collection(db, 'questionnaires');

export default async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            res.status(400).json({ error: 'ID parameter missing' });
            return;
        }
        const idStr = id.toString();
        const questionnaireDocRef = doc(questionnaireCollection, idStr);
        const answersCollectionRef = collection(questionnaireDocRef, 'questions');

        const answersQuery = query(answersCollectionRef);

        const answersQuerySnapshot = await getDocs(answersQuery);

        if (answersQuerySnapshot.empty) {
            res.status(404).json({ error: 'Answers not found' });
        } else {
            const answers = [];
            answersQuerySnapshot.forEach((doc) => {
                answers.push(doc.data());
            });
            res.status(200).json({ answers });
        }
    } catch (error) {
        console.error('Erro na API user-data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}