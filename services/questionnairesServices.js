import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const questionnaireCollection = collection(db, 'questionnaires');

export const getQuestionnaire = async (id) => {
    const docRef = doc(questionnaireCollection, `${id}`);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    return docData;
}

export const getQuestionnaireQuestions = async (id) => {
  const questionnaireRef = doc(questionnaireCollection, `${id}`, 'questions');
  return questionnaireRef;
}

export const getQuerionnaireTerm = async (id) => {
  const questionnaireRef = doc(questionnaireCollection, `${id}`);
  const questionnaireDoc = await getDoc(questionnaireRef);
  const questionnaireData = questionnaireDoc.data();
  return questionnaireData.term;
}