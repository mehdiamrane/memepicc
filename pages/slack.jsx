/* eslint-disable @next/next/no-img-element */
import React from "react";
import Head from "next/head";

const SlackPage = () => {
  return (
    <>
      <Head>
        <title>Add to slack</title>
      </Head>
      <a
        href="https://slack.com/oauth/v2/authorize?client_id=325158009555.2979888295156&scope=commands,chat:write&user_scope=chat:write">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
      </a>
    </>
  );
};

export default SlackPage;
