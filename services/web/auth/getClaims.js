import { auth } from "../initFirebase";

export const getClaims = () => {
  return new Promise((resolve, reject) => {
    auth.currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        resolve(idTokenResult.claims);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
