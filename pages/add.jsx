import React from "react";
import Head from "next/head";

import ContributeForm from "components/ContributeForm";
import { ProtectedPage } from "routing/ProtectedPage";

const AddPage = () => {
  return (
    <>
      <Head>
        <title>Add a meme | memepi.cc</title>
      </Head>
      <ContributeForm />;
    </>
  );
};

export default ProtectedPage(AddPage, "/");
