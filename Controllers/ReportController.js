import { db } from '../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp, or } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getJsonReport = async (data) => {
  try {

    if (data.tipo.includes('null')) {
      data.tipo = data.tipo.map((t) => (t === 'null' ? null : t));
    }

    let usersQuery = query(usersCollection, where('athleteLevel', 'in', data.tipo));
    if (data.tipo.includes(null)) {
      usersQuery = query(usersCollection, or(where('athleteLevel', '==', null), where('athleteLevel', 'in', data.tipo)));
    }
    const usersSnapshot = await getDocs(usersQuery);

    const usersAnswers = await Promise.allSettled(
      usersSnapshot.docs.map(async (userDoc) => {
        const answersCollectionQuery = query(
          collection(db, 'users', userDoc.id, 'answers'),
          where('created_at', '>=', Timestamp.fromMillis(data.inicio)),
          where('created_at', '<=', Timestamp.fromMillis(data.fim)),
          orderBy('created_at', 'desc'),
        );
        const answersSnapshot = await getDocs(answersCollectionQuery);
        const answers = answersSnapshot.docs.map((doc) => doc.data());
        return { user: userDoc.data(), answers };
      })
    );
    return usersAnswers.map((result) => result.value);
  } catch (error) {
    throw error;
  }
};
