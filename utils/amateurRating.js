
const calculateAverage = (arr) => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

const averageSample = async (sample) => {
    for (const prop in sample) {
        if (Object.prototype.hasOwnProperty.call(sample, prop)) {
            const arr = sample[prop];
            const avg = calculateAverage(arr);
            sample[prop] = {
                average: avg,
                values: arr,
            };
        }
    }
    return sample;
}

const standardDeviation = async (data) => {
    const values = data;
    for (const prop in values) {
        if (Object.prototype.hasOwnProperty.call(values, prop)) {
            const arr = values[prop].values;
            const avg = values[prop].average;
            const squareDiffs = arr.map((value) => {
                const diff = value - avg;
                const sqrDiff = diff * diff;
                return sqrDiff;
            });
            const avgSquareDiff = calculateAverage(squareDiffs);
            const stdDev = Math.sqrt(avgSquareDiff);
            values[prop].stdDev = stdDev;
        }
    }
    return values;
}

export default async function amateurRating (score, sample, isClassified){
    if (isClassified) {
        for (const dimension in sample) {
            for (const [key, value] of Object.entries(sample[dimension])) {
                if (value === score[dimension]) {
                    sample[dimension].splice(key, 1)
                    break;
                }
            }
        }
    }
    const value = await averageSample(sample, isClassified);
    const rating = await standardDeviation(value);
    const userRank = zUserScore(rating, score);
    const userScore = tUserScore(userRank, score);
    const userRanked = rankUser(userScore);
    const userRankOnly = {};
    let newSample = {};
    Object.keys(userRanked).forEach((key) => {
        userRankOnly[key] = userRanked[key].rank;
        newSample[key] = userRanked[key].values;
    })
    return [userRankOnly, newSample];
}

const zUserScore = (rating, score) => {
    Object.keys(score).forEach((key) => {
        const zScore = (score[key] - rating[key].average) / rating[key].stdDev;
        rating[key].zScore = zScore;
    })
    return rating;
}

const tUserScore = (rating, score) => {
    Object.keys(score).forEach((key) => {
        const tScore = (rating[key].zScore * 10) + 50;
        rating[key].tScore = tScore;
    })
    return rating;
}

const rankUser = (rating) => {
    Object.keys(rating).forEach((key) => {
        const tScore = rating[key].tScore;
        if (tScore < 30) {
            rating[key].rank = "Extremamente baixo";
        } else if (tScore >= 30 && tScore < 40) {
            rating[key].rank = "Baixo";
        } else if (tScore >= 40 && tScore < 60) {
            rating[key].rank = "Moderado";
        } else if (tScore >= 60 && tScore < 70) {
            rating[key].rank = "Alto";
        } else if (tScore >= 70) {
            rating[key].rank = "Extremamente alto";
        }
    })
    return rating;
}