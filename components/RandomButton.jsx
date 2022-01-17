import React from "react";
import PropTypes from "prop-types";

import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsFillDice5Fill } from "react-icons/bs";

const RandomButton = ({ buttonText, ...props }) => (
  <NextLink href="/random" passHref>
    <Button
      as="a"
      variant="solid"
      rounded="lg"
      rightIcon={<BsFillDice5Fill />}
      borderWidth="2px"
      {...props}
    >
      {buttonText || "Random"}
    </Button>
  </NextLink>
);

RandomButton.propTypes = {
  buttonText: PropTypes.string,
};

RandomButton.defaultProps = {
  buttonText: undefined,
};

export default RandomButton;
