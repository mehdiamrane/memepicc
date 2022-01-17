const slackHandler = async (req, res) => {
  const { text } = req.body;

  console.log("incoming text", text);

  const response = {
    response_type: "in_channel",
    text: `https://memes.pm/${text}`,
  };

  return res.status(200).json(response);
};

export default slackHandler;

export const config = {
  api: {
    externalResolver: true,
  },
};
