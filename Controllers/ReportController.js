import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getJsonReport = async (data) => {
  try {
    const usersQuery = query(usersCollection, where('athleteLevel', 'in', data.tipo));
    const usersSnapshot = await getDocs(usersQuery);
    let usersAnswers = [];

    await Promise.all(
      usersSnapshot.docs.map(async (userDoc) => {
        const answersCollectionQuery = query(
          collection(db, 'users', userDoc.id, 'answers'),
          where('created_at', '>=', Timestamp.fromMillis(data.inicio)),
          where('created_at', '<=', Timestamp.fromMillis(data.fim)),
          orderBy('created_at', 'desc'),
          limit(1)
        );

        const answersSnapshot = await getDocs(answersCollectionQuery);
        usersAnswers.push({
          user: userDoc.data(),
          answers: answersSnapshot.docs.map((doc) => doc.data()),
        });
      })
    );

    return usersAnswers;
  } catch (error) {
    throw error;
  }
};
