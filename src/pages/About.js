import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import Layout from "../layouts/Layout";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import AboutContent from "../components/about-contents/AboutContent";
import AboutContentTwo from "../components/about-contents/AboutContentTwo";
import VideoPopup from "../components/video-popups/VideoPopup";

const About = () => {
  return (
    <Fragment>
      <MetaTags>
        <title>CoinPay | Multi-CryptoCurrency</title>
        <meta
          name="description"
          content="About page of React JS Crypto Currency Template."
        />
      </MetaTags>
      <Layout theme="white">
        {/* breadcrumb */}
        <Breadcrumb title="About Us" />
        {/* about content */}
        <AboutContent />
        {/* video popup */}
        <VideoPopup />
        {/* about content two */}
        <AboutContentTwo />
      </Layout>
    </Fragment>
  );
};

export default About;
