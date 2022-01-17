import React from "react";
import { Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <Text
        as="a"
        fontSize="lg"
        fontWeight="bold"
        color="gray.200"
        _hover={{ color: "white" }}
        transition="color 150ms ease"
      >
        memes.pm
      </Text>
    </NextLink>
  );
};

export default Logo;
