import { stringify } from "zipson";

export const searchModal = ({ triggerId, channelId, threadTs, postedWith }) => {
  const payload = stringify({
    conversation: {
      channelId,
      threadTs,
    },
    postedWith,
  });

  return {
    trigger_id: triggerId,
    view: {
      type: "modal",
      callback_id: "modal_search",
      private_metadata: payload,
      title: {
        type: "plain_text",
        text: "Memes.pm",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Close",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Search",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: "search_block",
          element: {
            type: "plain_text_input",
            action_id: "search_input",
            placeholder: {
              type: "plain_text",
              text: "Search memes.pm",
            },
            focus_on_load: true,
            max_length: 1000,
            min_length: 2,
          },
          label: {
            type: "plain_text",
            text: "Search for a meme",
            emoji: true,
          },
        },
      ],
    },
  };
};
