import { formatTenorQuery } from "utils/formatTenorQuery";
import { formatFileName } from "utils/formatFileName";
import { formatKeywords } from "utils/formatKeywords";

export const searchFallbackGif = ({ query }) => {
  return new Promise((resolve, reject) => {
    const tenorQuery = formatTenorQuery(query);

    const fetchUrl = `https://g.tenor.com/v1/random?key=${process.env.TENOR_API_KEY}&q=${tenorQuery}&limit=1`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((jsonRes) => {
        const result = jsonRes.results[0];

        const name = result.content_description;
        const filename = formatFileName({ name, extension: "gif" });
        const { url } = result.media[0].gif;
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
        resolve(meme);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
