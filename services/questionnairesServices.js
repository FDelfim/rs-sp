import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'questionnaires');

export const getQuestionnaire = async (id) => {
    const docRef = doc(usersCollection, `${id}`);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    console.log(docData)
    return docData;
}

export const getQuestionnaireQuestions = async (id) => {
  const questionnaireRef = doc(usersCollection, `${id}`, 'questions');
  return questionnaireRef;
}