import React from "react";
import { Flex, Stack, Text, IconButton } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-between"
      as="footer"
      py={0}
      h="55px"
      bg="gray.900"
      pl={4}
      pr={2}
      border="2px solid"
      borderBottom="0px"
      borderTopRadius="lg"
      borderColor="gray.600"
    >
      <Stack
        w="full"
        direction="row"
        spacing="4"
        align="center"
        justify="space-between"
      >
        <Text fontSize="sm" fontWeight="semibold" color="gray.500">
          &copy; {new Date().getFullYear()}, made to share juicy memes.
        </Text>
        <IconButton
          variant="ghost"
          color="gray.500"
          _hover={{ color: "gray.100", bg: "gray.600" }}
          as="a"
          href="https://github.com/mehdiamrane/memepicc"
          target="_blank"
          aria-label="GitHub"
          icon={<FaGithub fontSize="20px" />}
        />
      </Stack>
    </Flex>
  );
};

export default Footer;
