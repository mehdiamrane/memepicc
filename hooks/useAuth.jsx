import { useContext } from "react";

import { AuthContext } from "context/Auth";

export default function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
