import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  ButtonGroup,
  Input,
  Text,
  Textarea,
  RadioGroup,
  Stack,
  IconButton,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { upload, getFileFromUrl } from "services/web/storage/index";
import { add } from "services/web/database/index";
import InputLabel from "components/InputLabel";
import { formatFileName } from "utils/formatFileName";
import { formatKeywords } from "utils/formatKeywords";
import { RiDeleteBinLine } from "react-icons/ri";

const ContributeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    type: "image",
    keywords: "",
    fileToUpload: undefined,
  });

  const toast = useToast();
  const fileInputRef = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () =>
      formData.name &&
      formData.type &&
      formData.keywords.length > 10 &&
      (formData.fileToUpload || formData.url.length > 3),
    [formData],
  );

  const clearFormData = () => {
    setFormData({
      name: "",
      url: "",
      type: "image",
      keywords: "",
      fileToUpload: undefined,
    });
    fileInputRef.current.value = null;
  };

  const handleError = (error) => {
    toast({
      title: "Error logging in",
      description: error.message,
      status: "error",
      position: "top-right",
      duration: 4000,
      isClosable: true,
    });
    setIsSubmitting(false);
  };

  const handleFormSuccess = () => {
    toast({
      title: "Meme successfully added!",
      description: "Thank you for your contribution soldier.",
      status: "success",
      position: "top-right",
      duration: 4000,
      isClosable: true,
    });
    clearFormData();
    setIsSubmitting(false);
  };

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleCheckboxChange = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, type: value }));
  };

  const removeFile = () => {
    fileInputRef.current.value = null;
    setFormData((prevFormData) => ({
      ...prevFormData,
      fileToUpload: undefined,
      type: "image",
    }));
  };

  const onFileChange = (event) => {
    const submittedFile = event.target.files[0];

    if (!submittedFile) {
      return;
    }

    const isGif = submittedFile.type.includes("gif");

    setFormData((prevFormData) => ({
      ...prevFormData,
      fileToUpload: submittedFile,
      type: isGif ? "gif" : "image",
      url: "",
    }));
  };

  const onSubmit = async () => {
    setIsSubmitting(true);
    let { fileToUpload } = formData;

    if (formData.url && !fileToUpload) {
      try {
        fileToUpload = await getFileFromUrl({
          url: formData.url,
          name: formData.name,
        });
      } catch (error) {
        handleError(error);
        return;
      }
    }

    let fileURL;

    const contentType = fileToUpload.type;
    const extension = contentType.split("/")[1];
    const fileName = formatFileName({ name: formData.name, extension });

    try {
      fileURL = await upload({
        contentType,
        file: fileToUpload,
        fileType: formData.type,
        fileName,
      });
    } catch (error) {
      handleError(error);
      return;
    }

    const keywords = formatKeywords(formData.keywords);

    add({
      url: fileURL,
      name: formData.name,
      filename: fileName,
      type: formData.type,
      keywords,
    })
      .then(() => {
        handleFormSuccess();
      })
      .catch((error) => {
        handleError(error);
        return;
      });
  };

  return (
    <Box
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
        Submit your meme
      </Heading>

      <Box mb={8}>
        <InputLabel htmlFor="url">URL</InputLabel>
        <Input
          variant="filled"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://mydankmemeurl.com/image.png"
          size="lg"
          isDisabled={formData.fileToUpload || isSubmitting}
        />

        <Text my={2}>OR</Text>

        <Flex
          align="center"
          justify="space-between"
          px={2}
          h={12}
          rounded="md"
          bg="whiteAlpha.50"
          color="whiteAlpha.800"
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file"
            name="file"
            accept="image/gif, image/png, image/jpeg, image/bmp, image/webp"
            onChange={onFileChange}
            disabled={isSubmitting}
          />

          {formData.fileToUpload && (
            <IconButton
              ml={4}
              h={8}
              variant="ghost"
              colorScheme="red"
              aria-label="Remove"
              icon={<RiDeleteBinLine fontSize="20px" />}
              onClick={removeFile}
            />
          )}
        </Flex>
      </Box>

      <Box mb={8}>
        <InputLabel htmlFor="type">File type: </InputLabel>
        <RadioGroup
          name="type"
          onChange={handleCheckboxChange}
          value={formData.type}
        >
          <Stack direction="row" spacing={6}>
            <Radio isDisabled={isSubmitting} value="image">
              Image
            </Radio>
            <Radio isDisabled={isSubmitting} value="gif">
              Gif
            </Radio>
            <Radio isDisabled={isSubmitting} value="video">
              Video
            </Radio>
          </Stack>
        </RadioGroup>
      </Box>

      <Box mb={8}>
        <InputLabel htmlFor="name">Name</InputLabel>
        <Input
          variant="filled"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isDisabled={isSubmitting}
          placeholder="Surprised Pikachu Face"
          size="lg"
        />
      </Box>

      <Box mb={8}>
        <InputLabel htmlFor="keywords">Keywords</InputLabel>
        <Textarea
          h="150px"
          variant="filled"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          isDisabled={isSubmitting}
          placeholder="surprised pikachu face shocked"
          size="lg"
          resize="vertical"
        />
      </Box>

      <Flex w="full" align="center" justify="flex-end">
        <ButtonGroup>
          <Button
            variant="solid"
            size="lg"
            colorScheme="brand"
            isDisabled={!canSubmit || isSubmitting}
            onClick={onSubmit}
          >
            Submit your meme
          </Button>
          <Button
            variant="outline"
            size="lg"
            borderWidth="2px"
            onClick={clearFormData}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

export default ContributeForm;
