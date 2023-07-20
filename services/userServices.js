import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getUser = async (userId) => {
  const userRef = doc(usersCollection, `${userId}`);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  return userData;
}

export const getUserAnswers = async (userId) => {
  const answersRef = collection(db, 'users', `${userId}`, 'answers');
  const answersSnapshot = await getDocs(answersRef);
  const answersData = [];
  for (const doc of answersSnapshot.docs) {
    const answer = doc.data();
    answersData.push(answer);
  }
  return answersData[0];
}

export const storeUser = async (user, uid) => {
  const userRef = doc(usersCollection, `${uid}`);
  await setDoc(userRef, user);
}

export const updateUser = async (user) => {
  const userRef = doc(usersCollection, `${user.uid}`);
  await updateDoc(userRef, user);
}