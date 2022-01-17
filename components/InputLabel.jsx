import React from "react";
import PropTypes from "prop-types";
import { FormLabel } from "@chakra-ui/react";

const InputLabel = ({ children, htmlFor, ...props }) => (
  <FormLabel
    fontWeight="semibold"
    textTransform="uppercase"
    fontSize="sm"
    mb={2}
    htmlFor={htmlFor}
    {...props}
  >
    {children}
  </FormLabel>
);

InputLabel.propTypes = {
  children: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
};

export default InputLabel;
