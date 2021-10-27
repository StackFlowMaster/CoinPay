import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import SoftwareDownload from "../components/software-downloads/SoftwareDownload";
import WorkProcess from "../containers/work-processes/WorkProcess";
import HowWorks from "../components/how-works/HowWorks";
import HeroSlider from "../containers/hero-sliders/HeroSlider";
import Layout from "../layouts/Layout";

class Home extends React.Component {
  render() {
    return (
        <Fragment>
          <MetaTags>
            <title>CoinPay | Multi-CryptoCurrency </title>
            <meta
              name="description"
              content="Homepage of CoinPay"
            />
          </MetaTags>
          <Layout theme="white">
            <HeroSlider />
            <WorkProcess />
            <HowWorks />
            <SoftwareDownload />
          </Layout>
        </Fragment>
    );
  }
};

export default Home;
