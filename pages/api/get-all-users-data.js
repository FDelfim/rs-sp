import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const usersCollection = collection(db, 'users');

export default async (req, res) => {
    try {
        if (JSON.parse(req.body).uid !== process.env.ADMIN_UID) {
            res.status(401).json({ error: 'Unauthorized' });
        } else {
            const q = query(usersCollection);
            const userDocs = await getDocs(q);

            if (userDocs.empty) {
                res.status(404).json({ error: 'Users not found' });
            } else {
                const users = [];

                for (const userDoc of userDocs.docs) {
                    const userData = userDoc.data();
                    const userUid = userDoc.id;

                    if (!userData.isSuperUser) {
                        const answersQuery = query(collection(db, 'users', userUid, 'answers'));
                        const answersDoc = await getDocs(answersQuery);

                        if(answersDoc.empty) continue;
                        for(const answerDoc of answersDoc.docs){
                            users.push({
                                uid: userUid,
                                answers: answerDoc.data(),
                                ...userData
                            });
                        }
                    }
                }

                res.status(200).json({ users });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
