import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  ButtonGroup,
  Input,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import useAuth from "hooks/useAuth";
import { useRouter } from "next/router";
import InputLabel from "components/InputLabel";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => formData.email && formData.password,
    [formData.email, formData.password],
  );

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      login({
        email: formData.email,
        password: formData.password,
      })
        .then(() => {
          toast({
            title: "Logged in",
            description: "You've successfully logged in!",
            status: "success",
            position: "top-right",
            duration: 4000,
            isClosable: true,
          });
          router.push("/add");
        })
        .catch((error) => {
          toast({
            title: "Error logging in",
            description: error.message,
            status: "error",
            position: "top-right",
            duration: 4000,
            isClosable: true,
          });
          setIsSubmitting(false);
        });
    },
    [formData, login, toast, router],
  );

  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      border="2px solid"
      borderColor="gray.100"
      shadow="xl"
      p={8}
      rounded="xl"
      bg="gray.800"
      w="full"
      h="full"
    >
      <Heading mb={8} pb={4} borderBottom="2px solid" borderColor="gray.200">
        Log in
      </Heading>

      <FormControl mb={8} isRequired>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          variant="filled"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="elon@spacex.com"
          size="lg"
        />
      </FormControl>

      <FormControl mb={8} isRequired>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          variant="filled"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          placeholder="mypassword"
          size="lg"
        />
      </FormControl>

      <Flex w="full" align="center" justify="flex-end">
        <ButtonGroup>
          <Button
            variant="solid"
            size="lg"
            colorScheme="brand"
            isDisabled={!canSubmit || isSubmitting}
            type="submit"
          >
            Log in
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default LoginForm;
