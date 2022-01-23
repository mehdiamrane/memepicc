import { db } from "services/api/initFirebase";
import { formatKeywords } from "utils/formatKeywords";
import { shuffleArray } from "utils/shuffleArray";

export const search = async ({ type, query, limit, randomize }) => {
  const searchedKeywords = formatKeywords(query);

  const memesRef = db.collection("memes");

  const makeQuery = () => {
    if (type) {
      return memesRef
        .where("keywords", "array-contains-any", searchedKeywords)
        .where("type", "==", type)
        .get();
    }
    return memesRef
      .where("keywords", "array-contains-any", searchedKeywords)
      .get();
  };

  const snapshot = await makeQuery();

  const results = [];

  if (snapshot.empty) {
    return null;
  }

  snapshot.forEach((doc) => {
    results.push(doc.data());
  });

  let highestScore = 1;

  results.forEach((res) => {
    res.score = res.keywords.filter((word) => {
      return searchedKeywords.indexOf(word) !== -1;
    }).length;

    highestScore = res.score > highestScore ? res.score : highestScore;
  });

  const bestScoreResults = results.filter((meme) => meme.score >= highestScore);

  // Send back an array of objects
  if (limit) {
    const responseResults = bestScoreResults.slice(0, limit);

    if (randomize && responseResults.length > 1) {
      return shuffleArray(responseResults);
    }

    return responseResults;
  }

  // Send just one random object
  const randomIndex = Math.floor(Math.random() * bestScoreResults.length);
  const randomMeme = bestScoreResults[randomIndex];
  return randomMeme;
};
