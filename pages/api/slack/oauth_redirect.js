import app from "services/api/slack/app";

export default app.requestListener;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
