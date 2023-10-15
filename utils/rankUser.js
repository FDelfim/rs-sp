export default function rankUser(dimensionSums, scale){
    const userRankings = {};
    for (const dimension in dimensionSums) {
      const value = dimensionSums[dimension];
      const dimensionScale = scale[dimension];

      if (value >= parseFloat(dimensionScale.extremelyHigh)) {
        userRankings[dimension] = 'Extremamente Alto';
      } else if (value <= parseFloat(dimensionScale.high) && value > parseFloat(dimensionScale.moderate)) {
        userRankings[dimension] = 'Alto';
      } else if (value <= parseFloat(dimensionScale.moderate) && value > parseFloat(dimensionScale.low)) {
        userRankings[dimension] = 'Moderado';
      } else if (value <= parseFloat(dimensionScale.low) && value > parseFloat(dimensionScale.extremelyLow)) {
        userRankings[dimension] = 'Baixo';
      } else {
        userRankings[dimension] = 'Extremamente Baixo';
      }
    }
    return userRankings;
}