import { reverseTranslate, translate } from "../translates";

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