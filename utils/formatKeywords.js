export const formatKeywords = (keywordsString) => {
  const resultString = keywordsString.toLowerCase().replace(/[^a-zA-Z]+/g, "-");
  const resultArray = resultString.split("-").filter((word) => word.length > 1);
  const uniqueArray = [...new Set(resultArray)];

  return uniqueArray;
};
