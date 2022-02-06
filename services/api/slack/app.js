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
  // loadingModal,
} from "services/api/slack/modals";
import { searchMemes } from "services/api/slack";
import {
  storeInstallation,
  fetchInstallation,
  deleteInstallation,
} from "services/api/database";
import { parse } from "zipson";

const receiver = new HTTPReceiver({
  // logLevel: LogLevel.ERROR,
  endpoints: ["/api/slack/events", "/api/slack/oauth_redirect"],
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_APP_CLIENT_ID,
  clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true,
  scopes: ["chat:write", "commands"],
  redirectUri: `https://${process.env.BASE_DOMAIN}/api/slack/oauth_redirect`,
  installationStore: {
    storeInstallation,
    fetchInstallation,
    deleteInstallation,
  },
  installerOptions: {
    userScopes: ["chat:write"],
    redirectUriPath: "/api/slack/oauth_redirect",
    stateVerification: false,
  },

  //   customPropertiesExtractor: (req) => {
  //     return {
  //       headers: req.headers,
  //       foo: "bar",
  //     };
  //   },

  // other custom handlers
  dispatchErrorHandler: ({ error, logger, response }) => {
    logger.error(`dispatch error: ${error}`);
    response.writeHead(404);
    response.write("Something is wrong!");
    response.end();
  },
  processEventErrorHandler: ({ error, logger, response }) => {
    logger.error(`processEvent error: ${error}`);
    // acknowledge it anyway!
    response.writeHead(200);
    response.end();
    return true;
  },
  unhandledRequestHandler: async ({ logger, response }) => {
    // acknowledge it anyway!
    logger.info(
      "Acknowledging this incoming request because 3 seconds already passed...",
    );
    response.writeHead(200);
    response.end();
  },
  unhandledRequestTimeoutMillis: 3001, // the default is 3001
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  receiver,
  ignoreSelf: true,
});

// Returns an error if no user token is found in DB.
// Could also be a listener but simpler like this because we need to ack() before.
const checkUserToken = ({ context }) => {
  if (!context.userToken) {
    const customAuthError = {
      data: {
        error: "custom_needs_auth",
      },
    };
    throw customAuthError;
  }
};

// When invoking the meme shortcut (not to be confused with /meme command).
app.shortcut(
  /(meme_global_shortcut|meme_message_shortcut)/,
  async ({ shortcut, ack, logger, context, client, respond }) => {
    try {
      await ack();
      checkUserToken({ context });

      await client.views.open(
        searchModal({
          triggerId: shortcut.trigger_id,
          channelId: shortcut.channel?.id,
          threadTs: shortcut.message?.thread_ts || shortcut?.message?.ts,
          postedWith: "shortcut",
        }),
      );
    } catch (error) {
      await respond(errorResponse(error));
      logger.error(error);
    }
  },
);

// After submitting the search input inside the modal.
app.view("modal_search", async ({ ack, body, logger, context, client }) => {
  try {
    await ack({
      response_action: "update",
    });

    checkUserToken({ context });

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
    // await respond(errorResponse(error));
    logger.error(error);
  }
});

// When shuffling through memes inside modal.
app.action("modal_shuffle", async ({ ack, body, client, context, logger }) => {
  try {
    ack({
      response_action: "update",
    });
    checkUserToken({ context });

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
    // await respond(errorResponse(error));
    logger.error(error);
  }
});

// When submitting the picked meme in shuffle view modal.
app.view("shuffle_view", async ({ body, ack, client, logger, context }) => {
  try {
    await ack();
    checkUserToken({ context });

    const { meme, conversation, postedWith } = parse(
      body.view.private_metadata,
    );
    const response = pickedMemeResponse({
      meme,
      userId: body.user.id,
      channelId: conversation?.channelId || body.response_urls[0].channel_id,
      ...(conversation?.threadTs && { threadTs: conversation.threadTs }),
      token: context.userToken,
      postedWith,
    });

    await client.chat.postMessage(response);
  } catch (error) {
    // await respond(errorResponse(error));
    logger.error(error);
  }
});

// When user types /meme [keywords] in slack
app.command(
  "/meme",
  async ({ command, ack, respond, client, logger, context }) => {
    try {
      console.log("ack");
      await ack();
      console.log("checkUserToken");
      checkUserToken({ context });

      if (command.text.length === 0) {
        await client.views.open(
          searchModal({ triggerId: command.trigger_id, postedWith: "command" }),
        );
        return;
      }

      const memes = await searchMemes({ query: command.text });

      const response = shuffleMemeResponse({ memes, currentIndex: 0 });
      console.log("sending response");

      await respond(response);
    } catch (error) {
      console.log("error", error);
      await respond(errorResponse(error));
      logger.error(error);
    }
  },
);

// When user clicks on Shuffle button in message
app.action("shuffle", async ({ ack, respond, context, body, logger }) => {
  try {
    await ack();
    checkUserToken({ context });

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
    await respond(errorResponse(error));
    logger.error(error);
  }
});

// When user clicks on Send button in message
app.action("send", async ({ ack, respond, body, client, context, logger }) => {
  try {
    await ack();
    checkUserToken({ context });

    const [payload] = body.actions.filter((item) => item.action_id === "send");
    const meme = parse(payload.value);
    const response = pickedMemeResponse({
      meme,
      userId: body.user.id,
      channelId: body.channel.id,
      postedWith: "command",
      token: context.userToken,
    });

    await client.chat.postMessage(response);
    await respond(deleteOriginalResponse());
  } catch (error) {
    await respond(errorResponse(error));
    logger.error(error);
  }
});

// When user clicks on Cancel button in message
app.action("cancel", async ({ ack, respond, logger }) => {
  try {
    await ack();
    await respond(deleteOriginalResponse());
  } catch (error) {
    await respond(errorResponse(error));
    logger.error(error);
  }
});

export default receiver;
