import { db } from "services/api/initFirebase";
import { formatKeywords } from "utils/formatKeywords";

export const search = async ({ type, query }) => {
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

  const randomIndex = Math.floor(Math.random() * bestScoreResults.length);

  const randomMeme = bestScoreResults[randomIndex];
  delete randomMeme.score;

  return randomMeme;
};
