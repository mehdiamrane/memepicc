import { stringify } from "zipson";

export const shuffleModal = ({
  viewId,
  viewHash,
  memes,
  currentIndex,
  conversation,
  postedWith,
}) => {
  const baseStorageURL =
    "https://firebasestorage.googleapis.com/v0/b/memepicc-22.appspot.com/o/";

  const currentMeme = {
    name: memes[currentIndex].name,
    url: memes[currentIndex].url.startsWith("http")
      ? memes[currentIndex].url
      : baseStorageURL + memes[currentIndex].url,
  };

  const payload = stringify({
    meme: currentMeme,
    conversation,
    postedWith,
  });

  const shufflePayload = stringify({
    memes,
    currentIndex,
  });

  const shuffleButtonText = `Shuffle (${currentIndex + 1}/${memes.length})`;

  const textBlock = {
    type: "section",
    text: {
      type: "plain_text",
      text: "Will be shared as a reply in current thread",
      emoji: true,
    },
  };

  const conversationsBlock = {
    type: "input",
    block_id: "conversations_block",
    element: {
      type: "conversations_select",
      action_id: "conversations_select",
      default_to_current_conversation: true,
      response_url_enabled: true,
      placeholder: {
        type: "plain_text",
        text: "Select conversations",
        emoji: true,
      },
    },
    label: {
      type: "plain_text",
      text: "Share with",
      emoji: true,
    },
  };

  const conversationContext =
    conversation?.channelId && conversation?.threadTs
      ? textBlock
      : conversationsBlock;

  // console.log("triggerId", triggerId);
  return {
    ...(viewId && { view_id: viewId }),
    ...(viewHash && { hash: viewHash }),
    ...(!viewId && !viewHash && { response_action: "update" }),
    view: {
      type: "modal",
      callback_id: "shuffle_view",
      private_metadata: payload,
      title: {
        type: "plain_text",
        text: "Memes.pm",
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Send",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Not the right meme?",
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: shuffleButtonText,
              emoji: true,
            },
            value: shufflePayload,
            action_id: "modal_shuffle",
          },
        },
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
        conversationContext,
      ],
    },
  };
};
