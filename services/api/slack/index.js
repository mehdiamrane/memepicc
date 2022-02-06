import { formatSlackQuery } from "utils/formatSlackQuery";
import { search } from "services/api/database";
import { searchFallbackGif } from "services/api/tenor/searchFallbackGif";

export const searchMemes = async ({ query }) => {
  console.log("start search meme");
  const searchQuery = formatSlackQuery(query);

  const foundMemes = await search({
    query: searchQuery,
    limit: 10,
    randomize: true,
  });

  const memes = [];

  if (foundMemes !== null) {
    const baseStorageURL =
      "https://firebasestorage.googleapis.com/v0/b/memepicc-22.appspot.com/o/";

    // keep only needed keys (because of slack's 2000 max chars payload limit)
    foundMemes.forEach(({ name, url }) => {
      memes.push({
        name,
        url: url.replace(baseStorageURL, ""),
      });
    });
  }

  if (memes.length < 10) {
    const fallbackMemes = await searchFallbackGif({
      query: searchQuery,
      limit: 10 - memes.length,
    });

    fallbackMemes.forEach(({ name, url }) => {
      memes.push({
        name,
        url,
      });
    });
  }
  console.log("returns memes");
  return memes;
};
