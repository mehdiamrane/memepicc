export const formatFileName = ({ name, extension }) => {
  const formattedName = name.replace(/\s+/g, "-").trim().toLowerCase();
  return `${formattedName}.${extension}`;
};
