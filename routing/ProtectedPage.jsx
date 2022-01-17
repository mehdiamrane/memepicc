import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "hooks/useAuth";
import LoadingBlock from "components/LoadingBlock";

export const ProtectedPage = (Component, fallbackPage) => {
  return function useProtectedPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.push(fallbackPage || "/login");
      }
    }, [loading, isAuthenticated, router]);

    if (!isAuthenticated || loading) {
      return <LoadingBlock />;
    }

    // eslint-disable-next-line prefer-rest-params
    return <Component {...arguments} />;
  };
};
