import React from "react";
import Head from "next/head";

import LoginForm from "components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Log in | memes.pm</title>
      </Head>
      <LoginForm />;
    </>
  );
};

export default LoginPage;
