export const errorResponse = (error) => {
  let text;

  switch (error?.data?.error) {
    case "not_in_channel":
      text =
        "This bot is not in the current channel. Type `/invite @memes.pm` and then try again.";
      break;

    case "channel_not_found":
      text = "Unfortunately, I can't send messages in private channels.";
      break;

    case "token_revoked":
      text =
        "Your auth token has been revoked by you or someone else. You can re-authorize this app by <https://memes.pm/slack|following these steps>.";
      break;

    case "custom_needs_auth":
      text =
        "Hey there :wave: You first need to <https://memes.pm/slack|authorize this app> to be able to post dank memes!";
      break;

    default:
      text = "Uh oh, an error happened. Please try again later.";
      break;
  }

  return {
    response_type: "ephemeral",
    replace_original: true,
    text,
  };
};
