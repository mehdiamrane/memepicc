import React from "react";
import { Flex, Stack, ButtonGroup, Button, IconButton } from "@chakra-ui/react";
import NextLink from "next/link";
import useAuth from "hooks/useAuth";
import { HiOutlinePlus } from "react-icons/hi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

import Logo from "./Logo";
import RandomButton from "./RandomButton";

const Header = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Flex
      as="header"
      bg="gray.900"
      border="2px solid"
      borderTop="0px"
      borderBottomRadius="lg"
      borderColor="gray.600"
      shadow="md"
      direction="row"
      align="center"
      justify="space-between"
      h="60px"
      pr={2}
      pl={4}
    >
      <Stack w="full">
        <Stack
          direction="row"
          spacing="4"
          align="center"
          justify="space-between"
        >
          <Logo />
          {isAuthenticated ? (
            <ButtonGroup colorScheme="brand">
              <NextLink href="/add" passHref>
                <Button
                  as="a"
                  variant="solid"
                  rounded="lg"
                  rightIcon={<HiOutlinePlus />}
                >
                  Add
                </Button>
              </NextLink>
              <NextLink href="/logout" passHref>
                <Button
                  as="a"
                  variant="outline"
                  border="2px"
                  rounded="lg"
                  rightIcon={<MdLogout />}
                >
                  Log out
                </Button>
              </NextLink>
            </ButtonGroup>
          ) : (
            <ButtonGroup colorScheme="brand">
              <RandomButton />
              <NextLink href="/login" passHref>
                <IconButton
                  as="a"
                  variant="outline"
                  border="2px"
                  rounded="lg"
                  icon={<FaRegUserCircle />}
                />
              </NextLink>
            </ButtonGroup>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Header;
