import React from "react";
import Head from "next/head";
import { AspectRatio } from "@chakra-ui/react";

const RandomPage = () => {
  return (
    <>
      <Head>
        <title>Random | memepi.cc</title>
      </Head>
      <AspectRatio width="full" ratio={16 / 9}>
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&autoplay=1"
          title="YouTube video player"
          frameBorder="0"
          autoPlay
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>
    </>
  );
};

export default RandomPage;
