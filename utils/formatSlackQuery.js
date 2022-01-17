import { formatKeywords } from "./formatKeywords";

export const formatSlackQuery = (query) => {
  const keywords = formatKeywords(query);
  const slackQuery = keywords.join("-");

  return slackQuery;
};
