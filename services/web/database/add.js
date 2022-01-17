import { collection, addDoc } from "firebase/firestore";
import { db } from "../initFirebase";

const add = ({ url, name, filename, type, keywords }) => {
  return new Promise((resolve, reject) => {
    const data = { name, url, type, keywords, filename };

    addDoc(collection(db, "memes"), data)
      .then((DocumentData) => {
        resolve(DocumentData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default add;
