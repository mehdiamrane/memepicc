import React, { useEffect } from "react";
import Head from "next/head";

import useAuth from "hooks/useAuth";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import LoadingBlock from "components/LoadingBlock";

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const toast = useToast();

  useEffect(() => {
    logout()
      .then(() => {
        toast({
          title: "Signed out",
          description: "You've successfully signed out. Come back anytime!",
          status: "success",
          position: "top-right",
          duration: 4000,
          isClosable: true,
        });
        router.push("/");
      })
      .catch((error) => {
        toast({
          title: "Error signing out",
          description: error.message,
          status: "error",
          position: "top-right",
          duration: 4000,
          isClosable: true,
        });
        router.push("/");
      });
  }, [logout, router, toast]);

  return (
    <>
      <Head>
        <title>Logging out | memes.pm</title>
      </Head>
      <LoadingBlock />;
    </>
  );
};

export default LogoutPage;
