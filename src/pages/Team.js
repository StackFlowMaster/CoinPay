import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import Layout from "../layouts/Layout";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import TeamContent from "../containers/teams/TeamContent";

const Team = () => {
  return (
    <Fragment>
      <MetaTags>
        <title>CoinPay | Multi-CryptoCurrency</title>
        <meta
          name="description"
          content="Team page of React JS Crypto Currency Template."
        />
      </MetaTags>
      <Layout theme="white">
        {/* breadcrumb */}
        <Breadcrumb title="OUR TEAM" />
        {/* team content */}
        <TeamContent />
      </Layout>
    </Fragment>
  );
};

export default Team;
