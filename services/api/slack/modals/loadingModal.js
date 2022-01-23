export const loadingModal = () => {
  return {
    response_action: "update",
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Memes.pm",
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Loading...",
          },
        },
      ],
    },
  };
};
