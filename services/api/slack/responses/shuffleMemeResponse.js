import { stringify } from "zipson";

export const shuffleMemeResponse = ({ memes, currentIndex }) => {
  const baseStorageURL =
    "https://firebasestorage.googleapis.com/v0/b/memepicc-22.appspot.com/o/";

  const currentMeme = {
    name: memes[currentIndex].name,
    url: memes[currentIndex].url.startsWith("http")
      ? memes[currentIndex].url
      : baseStorageURL + memes[currentIndex].url,
  };

  const memePayload = stringify(currentMeme);

  const shufflePayloadJSON = {
    memes,
    currentIndex,
  };

  const shufflePayload = stringify(shufflePayloadJSON);

  const shuffleButtonText = `Shuffle (${currentIndex + 1}/${memes.length})`;

  return {
    response_type: "ephemeral",
    replace_original: true,
    text: "Shuffle through memes",

    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: currentMeme.name,
          emoji: true,
        },
        image_url: currentMeme.url,
        alt_text: currentMeme.name,
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            style: "primary",
            text: {
              type: "plain_text",
              text: "Send",
              emoji: true,
            },
            value: memePayload,
            action_id: "send",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: shuffleButtonText,
              emoji: true,
            },
            value: shufflePayload,
            action_id: "shuffle",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Cancel",
              emoji: true,
            },
            action_id: "cancel",
          },
        ],
      },
    ],
  };
};
