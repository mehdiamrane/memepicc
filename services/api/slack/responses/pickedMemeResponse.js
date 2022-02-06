export const pickedMemeResponse = ({
  meme,
  channelId,
  threadTs,
  postedWith,
  token,
}) => {
  const postedWithText =
    postedWith === "shortcut"
      ? "Posted with the <https://memes.pm/slack|Memes shortcut>"
      : "Posted using <https://memes.pm/slack|/meme>";

  return {
    response_type: "in_channel",
    replace_original: true,
    as_user: true,
    token,
    channel: channelId,
    text: meme.name,
    ...(threadTs && { thread_ts: threadTs }),

    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: meme.name,
          emoji: true,
        },
        image_url: meme.url,
        alt_text: meme.name,
      },
      {
        type: "context",
        elements: [
          {
            type: "image",
            image_url: "https://memes.pm/assets/logo.png",
            alt_text: "Memes.pm",
          },
          {
            type: "mrkdwn",
            text: postedWithText,
          },
        ],
      },
    ],
  };
};
