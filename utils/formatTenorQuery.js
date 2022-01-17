import { formatKeywords } from "./formatKeywords";

export const formatTenorQuery = (query) => {
  const keywords = formatKeywords(query);
  const tenorQuery = keywords.join("%20");

  return tenorQuery;
};
