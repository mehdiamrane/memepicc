import { App, HTTPReceiver } from "@slack/bolt";
import {
  shuffleMemeResponse,
  pickedMemeResponse,
  deleteOriginalResponse,
  errorResponse,
} from "services/api/slack/responses";
import {
  searchModal,
  shuffleModal,
  loadingModal,
} from "services/api/slack/modals";
import { searchMemes } from "services/api/slack";
import { parse } from "zipson";

const receiver = new HTTPReceiver({
  endpoints: "/api/slack/events",
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_USER_TOKEN,
  receiver,
  ignoreSelf: true,
});

// When invoking the meme shortcut (not to be confused with /meme command).
app.shortcut("meme_shortcut", async ({ shortcut, ack, logger, client }) => {
  try {
    await ack();

    await client.views.open(
      searchModal({
        triggerId: shortcut.trigger_id,
        channelId: shortcut.channel?.id,
        threadTs: shortcut.message?.thread_ts || shortcut?.message?.ts,
        postedWith: "shortcut",
      }),
    );
  } catch (error) {
    logger.error(error);
  }
});

// After submitting the search input inside the modal.
app.view("modal_search", async ({ body, ack, logger, client }) => {
  try {
    await ack(loadingModal());

    const query = body.view.state.values.search_block.search_input.value;
    const { conversation, postedWith } = parse(body.view.private_metadata);

    const memes = await searchMemes({ query });

    const response = shuffleModal({
      viewId: body.view.id,
      memes,
      currentIndex: 0,
      conversation,
      postedWith,
    });

    await client.views.update(response);
  } catch (error) {
    logger.error(error);
  }
});

// When shuffling through memes inside modal.
app.action("modal_shuffle", async ({ ack, body, client, logger }) => {
  try {
    // Acknowledge shortcut request
    await ack({
      response_action: "update",
    });

    const [payload] = body.actions.filter(
      (item) => item.action_id === "modal_shuffle",
    );
    const { conversation, postedWith } = parse(body.view.private_metadata);

    const shufflePayload = parse(payload.value);
    const { memes, currentIndex } = shufflePayload;
    const nextIndex = currentIndex + 1 === memes.length ? 0 : currentIndex + 1;

    const response = shuffleModal({
      viewId: body.view.id,
      viewHash: body.view.hash,
      memes,
      currentIndex: nextIndex,
      conversation,
      postedWith,
    });

    await client.views.update(response);
  } catch (error) {
    logger.error(error);
  }
});

// When submitting the picked meme in shuffle view modal.
app.view("shuffle_view", async ({ body, ack, client, logger }) => {
  try {
    await ack();

    const { meme, conversation, postedWith } = parse(
      body.view.private_metadata,
    );
    const response = pickedMemeResponse({
      meme,
      userId: body.user.id,
      channelId: conversation?.channelId || body.response_urls[0].channel_id,
      ...(conversation?.threadTs && { threadTs: conversation.threadTs }),
      postedWith,
    });

    await client.chat.postMessage(response);
  } catch (error) {
    logger.error(error);
  }
});

// When user types /meme [keywords] in slack
app.command("/meme", async ({ command, ack, respond, client }) => {
  try {
    await ack();

    if (command.text.length === 0) {
      await client.views.open(
        searchModal({ triggerId: command.trigger_id, postedWith: "command" }),
      );
      return;
    }

    const memes = await searchMemes({ query: command.text });

    const response = shuffleMemeResponse({ memes, currentIndex: 0 });

    await respond(response);
  } catch (error) {
    await respond(errorResponse());
  }
});

// When user clicks on Shuffle button in message
app.action("shuffle", async ({ ack, respond, body }) => {
  try {
    await ack();

    const [payload] = body.actions.filter(
      (item) => item.action_id === "shuffle",
    );

    const shufflePayload = parse(payload.value);
    const { memes, currentIndex } = shufflePayload;
    const nextIndex = currentIndex + 1 === memes.length ? 0 : currentIndex + 1;

    const response = shuffleMemeResponse({
      memes,
      currentIndex: nextIndex,
    });

    await respond(response);
  } catch (error) {
    await respond(errorResponse());
  }
});

// When user clicks on Send button in message
app.action("send", async ({ ack, respond, body, client }) => {
  try {
    await ack();

    const [payload] = body.actions.filter((item) => item.action_id === "send");
    const meme = parse(payload.value);
    const response = pickedMemeResponse({
      meme,
      userId: body.user.id,
      channelId: body.channel.id,
      postedWith: "command",
    });

    await client.chat.postMessage(response);
    await respond(deleteOriginalResponse());
  } catch (error) {
    await respond(errorResponse());
  }
});

// When user clicks on Cancel button in message
app.action("cancel", async ({ ack, respond }) => {
  try {
    await ack();
    await respond(deleteOriginalResponse());
  } catch (error) {
    await respond(errorResponse());
  }
});

export default receiver.requestListener;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
