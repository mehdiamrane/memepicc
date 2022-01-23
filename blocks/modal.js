const modal = () => {
  return {
    type: "modal",
    text: "Showing a modal",
    title: {
      type: "plain_text",
      text: "My App",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: "I Need a Marg",
          emoji: true,
        },
        image_url:
          "https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg",
        alt_text: "marg",
      },
    ],
  };
};

export default modal;
