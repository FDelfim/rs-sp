import { collection, doc, getDoc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import amateurRating from '../utils/amateurRating';
import { translate, reverseTranslate, colorScale } from '../utils/translates';


const usersCollection = collection(db, 'users');
const settingsCollection = collection(db, 'settings');
const questionnairesCollection = collection(db, 'questionnaires');

const rankUser = (dimensionSums, scale) => {
    let userRankings = {};
    for (const dimension in dimensionSums) {
        const value = dimensionSums[dimension];
        const dimensionScale = scale[dimension];
        if (dimensionScale) {
            if (value >= parseFloat(dimensionScale.extremelyHigh)) {
                userRankings[dimension] = 'Extremamente Alto';
            } else if (value <= parseFloat(dimensionScale.high) && value > parseFloat(dimensionScale.moderate)) {
                userRankings[dimension] = 'Alto';
            } else if (value <= parseFloat(dimensionScale.moderate) && value > parseFloat(dimensionScale.low)) {
                userRankings[dimension] = 'Moderado';
            } else if (value <= parseFloat(dimensionScale.low) && value > parseFloat(dimensionScale.extremelyLow)) {
                userRankings[dimension] = 'Baixo';
            } else if (value <= parseFloat(dimensionScale.extremelyLow)) {
                userRankings[dimension] = 'Extremamente Baixo';
            } else {
                userRankings[dimension] = 'Não classificado';
            }
        } else {
            userRankings[dimension] = 'Não classificado';
        }
    }
    const sortedKeys = Object.keys(userRankings).sort();
    const sortedUserRankings = {};
    for (const key of sortedKeys) {
        sortedUserRankings[key] = userRankings[key];
    }
    return sortedUserRankings;
}

export const dimensionsSums = (dimensions, answers, questionnaire) => {
    const dimensionSums = {};
    const dimensionCounts = {};

    dimensions.map((dimension) => {
      dimensionSums[dimension] = 0;	
      let dimensionTranslate = translate[dimension];
      dimensionCounts[dimension] = questionnaire.filter(q => q.dimension === dimensionTranslate).length;
    });

    questionnaire.forEach((question) => {
      const dimension = reverseTranslate[question.dimension];
      const questionIndex = questionnaire.indexOf(question);
      const answerKey = `question_${questionIndex + 1}`;

      if (answers[answerKey]) {
        const answerValue = parseInt(answers[answerKey]);
        dimensionSums[dimension] += answerValue;
      }
    });

    dimensionSums['total'] = Object.values(dimensionSums).reduce((a, b) => a + b) / (Object.values(dimensionSums).length - 1);
    return dimensionSums;
}

const getUserAnswers = async (id) => {
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

const getScale = async (id) => {
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

const getAmateurSample = async () => {
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

const getQuestionnaire = async (id) => {
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

const updateUser = async (user) => {
    try {
        const docRef = doc(usersCollection, user.id);
        await updateDoc(docRef, user);
    } catch (error) {
        throw error;
    }
}

const updateAmateurSample = async (sample) => {
    try {
        const docRef = doc(settingsCollection, 'amateurSample');
        await updateDoc(docRef, sample);
    } catch (error) {
        throw error;
    }
}

export const userRating = async (user) => {
    try{
        const userData = user;
        const answers = await getUserAnswers(user.userId);
        if(!answers) return {userRank: null, sums: null, answers: null}
        const questionnaire = await getQuestionnaire(answers.questionnaire);

        if(userData.isAthlete && answers){
            if(userData.athleteLevel === 'Profissional'){
                const scale = await getScale('professionalScale');
                const sums = dimensionsSums(Object.keys(scale), answers, questionnaire);
                const userRank = rankUser(sums, scale);
                return {userRank, sums, answers};
            }else{
                const sample = await getAmateurSample();
                const sums = dimensionsSums(Object.keys(sample), answers, questionnaire);
                const { userRankOnly, newSample } = await amateurRating(sums, sample, userData.isClassfied ?? false);
                console.log(newSample)
                return { userRank: userRankOnly, sums, answers };
            }
        }else if(answers){
            const dimensions = [...new Set(questionnaire.map(item => reverseTranslate[item.dimension]))];
            const sums = dimensionsSums(dimensions, answers, questionnaire);
            const userRank = {};
            Object.keys(sums).forEach((key) => {
                userRank[key] = sums[key]
            })
            return {userRank, sums, answers};
        }
        return {userRank: null, sums: null, answers: null};
    }catch(error){
        throw error;
    }
}