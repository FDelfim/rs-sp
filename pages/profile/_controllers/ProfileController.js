import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const usersCollection = collection(db, 'users');
const settingsCollection = collection(db, 'settings');
const questionnairesCollection = collection(db, 'questionnaires');

export const getUserData = async (id) => {
    try {
        const docRef = doc(usersCollection, id);
        const userDoc = await getDoc(docRef);
        if (!userDoc.exists()) {
            return null;
        } else {
            return userDoc.data();
        }
    } catch (error) {
        throw error;
    }
}

export const getUserAnswersData = async (id) => {
    try {
        const userDocRef = doc(usersCollection, id);
        const answersCollectionRef = collection(userDocRef, 'answers');
        const answersQuery = query(answersCollectionRef, orderBy('created_at', 'desc'), limit(1));
        const answersQuerySnapshot = await getDocs(answersQuery);
        
        if (answersQuerySnapshot.empty) {
            return null;
        } else {
            return answersQuerySnapshot.docs[0].data();
        }
    } catch (error) {
        throw error;
    }
}

export const getScaleData = async (id) => {
    try {
        const docRef = doc(settingsCollection, id);
        const scaleDoc = await getDoc(docRef);
        if (!scaleDoc.exists()) {
            return null;
        } else {
            return scaleDoc.data();
        }
    } catch (error) {
        throw error;
    }
}

export const getAmateurSampleData = async () => {
    try{
        const docRef = doc(settingsCollection, 'amateurSample');
        const amateurSampleDoc = await getDoc(docRef);
        if(!amateurSampleDoc.exists()){
            return null;
        }else{
            return amateurSampleDoc.data();
        }
    }catch(error){
        throw error;
    }
}

export const getQuestionnaireData = async (id) => {
    try {
        const questionnaireDocRef = doc(questionnairesCollection, id);
        const answersCollectionRef = collection(questionnaireDocRef, 'questions');

        const answersQuery = query(answersCollectionRef);
        const answersQuerySnapshot = await getDocs(answersQuery);
    
        if (answersQuerySnapshot.empty) {
            return null;
        } else {
            const answers = [];
            answersQuerySnapshot.forEach((doc) => {
                answers.push(doc.data());
            });
            return answers;
        }
    } catch (error) {
        throw error;
    }
}

export const updateUserData = async (user) => {
    try {
        const docRef = doc(usersCollection, user.id);
        await updateDoc(docRef, user);
    } catch (error) {
        throw error;
    }
}

export const updateAmateurSampleData = async (sample) => {
    try {
        const docRef = doc(settingsCollection, 'amateurSample');
        await updateDoc(docRef, sample);
    } catch (error) {
        throw error;
    }
}