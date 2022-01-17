import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../initFirebase";

export const login = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
