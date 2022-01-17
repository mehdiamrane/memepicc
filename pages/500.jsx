import React from "react";
import Head from "next/head";

import { Heading } from "@chakra-ui/react";

const Page404 = () => {
  return (
    <>
      <Head>
        <title>Server Error | memes.pm</title>
      </Head>
      <Heading>500 - Server-side error occurred</Heading>
    </>
  );
};

export default Page404;
