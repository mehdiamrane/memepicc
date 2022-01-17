import React, { createContext, useMemo } from "react";
import useUserState from "hooks/useUserState";
import { login, logout } from "services/web/auth";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const userProps = useUserState();

  const values = useMemo(() => ({ ...userProps, login, logout }), [userProps]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
