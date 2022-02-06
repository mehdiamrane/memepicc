export const loadingModal = ({ viewHash, viewId }) => {
  return {
    view_id: viewId,
    hash: viewHash,
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
