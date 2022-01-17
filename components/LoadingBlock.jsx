import React from "react";
import { Flex, Spinner } from "@chakra-ui/react";

const LoadingBlock = () => {
  return (
    <Flex align="center" justify="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
      />
    </Flex>
  );
};

export default LoadingBlock;
