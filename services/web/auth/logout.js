import { signOut } from "firebase/auth";
import { auth } from "services/web/initFirebase";

export const logout = () => {
  return new Promise((resolve, reject) => {
    signOut(auth)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};
