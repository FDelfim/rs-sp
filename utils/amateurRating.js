const fetchAmateurRating = async () => {
    const response = await fetch('/api/settings/amateurSample?id=amateurSample')
    if(response.status !== 200){
        throw new Error(response.statusText);
    }
    return response.json();
}

const calculateAverage = (arr) => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

const averageSample = async () => {
    const values = await fetchAmateurRating();
    for (const prop in values) {
        if (Object.prototype.hasOwnProperty.call(values, prop)) {
            const arr = values[prop];
            const avg = calculateAverage(arr);
            values[prop] = {
                average: avg,
                values: arr,
            };
        }
    }
    return values;
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

export default async function amateurRating (score){
    const value = await averageSample();
    const rating = await standardDeviation(value);
    const userRank = zUserScore(rating, score);
    const userScore = tUserScore(userRank, score);
    const userRanked = rankUser(userScore);
    const userRankOnly = {};
    let sample = {};
    Object.keys(userRanked).forEach((key) => {
        userRankOnly[key] = userRanked[key].rank;
        sample[key] = userRanked[key].values;
    })
    return [userRankOnly, sample];
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