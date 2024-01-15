import { getQuestionnaireData, getScaleData, getUserAnswersData } from "../../Controllers/ProfileController"
import { dimensionsSums } from "./scale"



export const rankProfessionalUser = async (user) => {
    const sums = dimensionsSums(Object.keys(scale), answers, questionnaire);
    const userRank = rankUser(sums, scale);
    return {userRank, sums};
}