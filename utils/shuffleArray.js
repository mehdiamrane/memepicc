// A JavaScript implementation of the Durstenfeld shuffle, an optimized version of Fisher-Yates.
// https://stackoverflow.com/a/12646864

export const shuffleArray = (array) => {
  const arrayCopy = [...array];

  for (let i = arrayCopy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  return arrayCopy;
};
