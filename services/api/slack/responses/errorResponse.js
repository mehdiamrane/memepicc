export const errorResponse = () => {
  return {
    response_type: "ephemeral",
    replace_original: true,
    text: "Uh oh, an error happened. Please try again later :eye: :lips: :eye:",
  };
};
