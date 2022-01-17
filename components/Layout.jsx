import React from "react";
import PropTypes from "prop-types";
import { Box, Flex } from "@chakra-ui/react";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box bg="gray.900" w="full" h="full" px={4}>
      <Box mx="auto" maxW="3xl">
        <Header />
        <Flex
          as="main"
          minH="calc(100vh - 55px - 60px)"
          w="full"
          h="full"
          align="center"
          justify="center"
          py={12}
        >
          {children}
        </Flex>
        <Footer />
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
