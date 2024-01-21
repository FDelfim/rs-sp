import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

const questionnaireCollection = collection(db, 'reports');

export const getReport = async (id) => {
    const docRef = doc(questionnaireCollection, `${id}`);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    return docData;
}

export const storeReport = async (report) => {
    try{
        const docRef = doc(questionnaireCollection);
        await setDoc(docRef, report);
    }catch(error){
        throw error;
    }
}