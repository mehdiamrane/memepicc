/* eslint-disable react/prop-types */
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import Layout from "components/Layout";

import { AuthProvider } from "context/Auth";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
