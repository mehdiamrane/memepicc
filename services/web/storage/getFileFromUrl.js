import { validUrl } from "utils/regex";

export const getFileFromUrl = ({ url, name }) => {
  return new Promise((resolve, reject) => {
    if (!url.match(validUrl)) {
      reject(new Error("Invalid URL"));
    }
    fetch(url)
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        const file = new File([blob], name, { type: blob.type });
        resolve(file);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
