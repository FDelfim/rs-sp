import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getUser = async (userId) => {
  const userRef = doc(usersCollection, `${userId}`);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  return userData;
}

export const getUserAnswers = async (userId) => {
  const answersRef = collection(doc(usersCollection, userId), 'answers');
  const answersSnapshot = await getDocs(answersRef);
  const answersData = [];
  for (const doc of answersSnapshot.docs) {
    const answer = doc.data();
    answersData.push(answer);
  }
  return answersData;
}

export const storeUser = async (user, uid) => {
  const userRef = doc(usersCollection, `${uid}`);
  await setDoc(userRef, user);
}

export const updateUser = async (user) => {
  try{
    const userRef = doc(usersCollection, `${user.userId}`);
    await updateDoc(userRef, user);
  }catch(error){
    throw error;
  }
}

export const getUserInfo = async (user) => {
  try{
    const userRef = doc(usersCollection, `${user.uid}`);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    return userData;
  } catch (error) {
    return error;
  }
}

export const getAllUsersAnswers = async () => {
  const usersSnapshot = await getDocs(usersCollection);
  const usersData = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
    const userId = userDoc.id;
    const answersRef = collection(doc(usersCollection, userId), 'answers');
    const answersSnapshot = await getDocs(answersRef);
    const answersData = answersSnapshot.docs.map(answerDoc => answerDoc.data());
    return { userId, answersData };
  }));
  return usersData;
}
