import cookies from "js-cookie";

export const removeUserCookie = () => cookies.remove("auth");

export const getUserFromCookie = () => {
  const cookie = cookies.get("auth");
  if (!cookie) {
    return undefined;
  }
  try {
    const parsedCookie = JSON.parse(cookie);
    return parsedCookie;
  } catch (error) {
    removeUserCookie();
    return undefined;
  }
};

export const setUserCookie = (user) => {
  cookies.set("auth", JSON.stringify(user), {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
  });
};
