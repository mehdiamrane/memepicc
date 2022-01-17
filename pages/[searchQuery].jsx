import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { Heading, Box, Img, HStack, Tag, Text } from "@chakra-ui/react";
import { search } from "services/api/database";
import { searchFallbackGif } from "services/api/tenor/searchFallbackGif";

const SearchPage = ({ meme }) => {
  return (
    <>
      <Head>
        <title>{meme.name} | memes.pm</title>
        <meta property="og:title" content={meme.name} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meme.url} />
        <meta property="og:image" content={meme.url} />
      </Head>
      <Box w="full" h="full">
        <Heading
          size="lg"
          mb={6}
          pb={3}
          borderBottom="2px solid"
          borderColor="gray.600"
        >
          {meme.name}
        </Heading>

        <Img src={meme.url} alt={meme.filename} mb={6} mx="auto" />

        <Box bg="gray.800" p={3} rounded="xl">
          <Text
            color="gray.300"
            borderBottom="2px solid"
            borderColor="gray.700"
            mb={3}
            pb={2}
          >
            Keywords to search to (maybe) find this meme:
          </Text>
          <HStack spacing={2}>
            {meme.keywords.map((word) => (
              <Tag size="md" key={word} variant="outline" colorScheme="brand">
                {word}
              </Tag>
            ))}
          </HStack>
        </Box>
      </Box>
    </>
  );
};

SearchPage.propTypes = {
  meme: PropTypes.shape({
    name: PropTypes.string.isRequired,
    filename: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default SearchPage;

export async function getServerSideProps(context) {
  // TODO: HANDLE API ERRORS
  const { searchQuery } = context.params;

  let meme = await search({ query: searchQuery });

  if (meme === null) {
    meme = await searchFallbackGif({ query: searchQuery });
  }

  if (meme === null) {
    return {
      props: {},
      redirect: {
        permanent: false,
        destination: "/404",
      },
    };
  }
  return {
    props: { meme }, // will be passed to the page component as props
  };
}
