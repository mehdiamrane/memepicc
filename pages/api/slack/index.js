const { formatSlackQuery } = require("utils/formatSlackQuery");
const { search } = require("services/api/database");
const { searchFallbackGif } = require("services/api/tenor/searchFallbackGif");

const slackHandler = async (req, res) => {
  const { text } = req.body;
  const searchQuery = formatSlackQuery(text);

  let meme = await search({ query: searchQuery });

  if (meme === null) {
    meme = await searchFallbackGif({ query: searchQuery });
  }

  const response = {
    response_type: "in_channel",
    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: meme.name,
        },
        image_url: meme.url,
        alt_text: meme.name,
      },
    ],
  };

  return res.status(200).json(response);
};

export default slackHandler;

export const config = {
  api: {
    externalResolver: true,
  },
};
