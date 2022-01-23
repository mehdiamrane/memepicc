import { formatTenorQuery } from "utils/formatTenorQuery";
import { formatFileName } from "utils/formatFileName";
import { formatKeywords } from "utils/formatKeywords";

export const searchFallbackGif = ({ query, limit }) => {
  return new Promise((resolve, reject) => {
    const tenorQuery = formatTenorQuery(query);

    const fetchUrl = `https://g.tenor.com/v1/search?key=${
      process.env.TENOR_API_KEY
    }&q=${tenorQuery}&limit=${limit || 1}`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((jsonRes) => {
        const memes = [];
        const { results } = jsonRes;

        results.forEach((result) => {
          const name = result.content_description;
          const filename = formatFileName({ name, extension: "gif" });
          const { url } = result.media[0].tinygif;
          const queryWithName = `${query}-${name
            .toLowerCase()
            .split(" ")
            .filter((w) => w !== "gif")
            .join("-")}`;
          const keywords = formatKeywords(queryWithName);

          const meme = {
            name,
            filename,
            url,
            keywords,
          };

          memes.push(meme);
        });

        resolve(limit ? memes : memes[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
