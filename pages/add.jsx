import React from "react";
import Head from "next/head";

import ContributeForm from "components/ContributeForm";
import { ProtectedPage } from "routing/ProtectedPage";

const AddPage = () => {
  return (
    <>
      <Head>
        <title>Add a meme | memes.pm</title>
      </Head>
      <ContributeForm />;
    </>
  );
};

export default ProtectedPage(AddPage, "/");
