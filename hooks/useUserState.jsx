import { useEffect, useState } from "react";
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from "utils/userCookies";
import { mapUserData } from "utils/mapUserData";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "services/web/initFirebase";
import { getClaims } from "services/web/auth";

// USE USEAUTH HOOK INSTEAD OF THIS ONE.
const useUserState = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = onIdTokenChanged(auth, (userData) => {
      if (userData) {
        const mappedUserData = mapUserData(userData);
        setUserCookie(mappedUserData);
        setUser(mappedUserData);
        console.log(
          `Logged in with email: ${mappedUserData.email} and uid: ${mappedUserData.id}`,
        );
        getClaims()
          .then((claims) =>
            console.log(`You're ${!claims.admin ? "NOT " : ""}an admin`),
          )
          .catch((error) => console.log("Error getting claims", error));
        setLoading(false);
      } else {
        removeUserCookie();
        setUser();
        setLoading(false);
      }
    });

    const userFromCookie = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }

    setUser(userFromCookie);

    // eslint-disable-next-line consistent-return
    return () => {
      cancelAuthListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isAuthenticated: !!user, user, loading, setUser };
};

export default useUserState;
