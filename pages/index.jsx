import React from "react";
import Head from "next/head";
import { Stack, Box, Heading, Text } from "@chakra-ui/react";
import RandomButton from "components/RandomButton";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Home | memes.pm</title>
      </Head>
      <Box p={8} w="full" rounded="lg" bg="gray.800">
        <Stack spacing={4} align="center">
          <Heading textAlign="center">Welcome to memes.pm</Heading>
          <Stack spacing={1} align="center">
            <Text>Kinda empty, eh?</Text>
            <Text>Here, get a free meme</Text>
            <Text>👇</Text>
          </Stack>
          <Box>
            <RandomButton buttonText="I'm feeling lucky" />
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default HomePage;
