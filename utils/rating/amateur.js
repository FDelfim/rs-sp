import { getAmateurSampleData, getQuestionnaireData, getUserAnswersData } from "../../Controllers/ProfileController";
import amateurRating from "../amateurRating";
import { dimensionsSums } from "./scale"

export const rankAmateurUser = async (user) => {
    const answers = await getUserAnswersData(user.userId);
    const sample = await getAmateurSampleData();
    const questionnaire = await getQuestionnaireData(answers.questionnaire);
    const sums = dimensionsSums(Object.keys(sample), answers, questionnaire);
    const { rank, newSample } = await amateurRating(sums, sample, user.data.userData.isClassified ?? false);
    return { rank, sums, newSample };
}