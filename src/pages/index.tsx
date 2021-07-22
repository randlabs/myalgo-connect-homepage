import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import clsx from 'clsx';
import 'prismjs/themes/prism.css';
import React, { useEffect, useState } from 'react';
import Connect from '../components/homepage/Connect';
import SendTransaction from '../components/homepage/SendTransaction';
import SignTransaction from '../components/homepage/SignTransaction';
import AccountsProvider from "../context/accountsContext";
import ParamsProvider from "../context/paramsContext";
import { algodClient, connection } from '../utils/connections';
import './index.scss';
import { useInView } from 'react-intersection-observer';
import { sleep } from '../utils/algorand';
import { HardwareIcon, ExtensionIcon, FeatureIcon, WarningIcon } from './GlobalSvgIcons'
let timeoutResolution = null;

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [params, setParams] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [txToSend, setTxToSend] = useState();
  const [selectIcon, setSelectedIcon] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(0);
  const { ref, inView, entry } = useInView({ threshold: 0.3});
  const blue = "#245EC7";
  const white = "white";

  const onCompleteConnect = (accounts) => {
    setAccounts(accounts);
  };

  const callbackSignedTxn = (txToSendParm) => {
    setTxToSend(txToSendParm);
  }

  const getTransactionParams = async () => {
    try {
      const params = await algodClient.getTransactionParams().do();
      setParams(params);
    }
    catch (err) {
      console.error(err);
    }
    timeoutResolution = setTimeout(getTransactionParams, 100000);
  }

  useEffect(() => {
    if (timeoutResolution) clearTimeout(timeoutResolution);
    getTransactionParams();
  }, [])

  const applyEffect = async (toDisplay: number) => {
    if (toDisplay === selectIcon) return;
    setSlideOut(true);
    setSlideIn(false);
    setSelectedIcon(toDisplay);

    sleep(800).then(() => {
      setShouldDisplay(toDisplay);
    })

    sleep(1000).then(() => {
      setSlideIn(true)
    })
  }

  const renderIconSection = () => {
    return (
      <div className="icons">
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 0 ? "selected" : "")} onClick={() => applyEffect(0)}>
          <HardwareIcon fill={selectIcon === 0 ? white : blue} />
        </div>
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 1 ? "selected" : "")} onClick={() => applyEffect(1)}>
          <ExtensionIcon fill={selectIcon === 1 ? white : blue} />
        </div>
        <div className={clsx("feature-icon icon-container", "scale-on-hover", selectIcon === 2 ? "selected" : "")} onClick={() => applyEffect(2)}>
          <FeatureIcon fill={selectIcon === 2 ? white : blue} />
        </div>
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 3 ? "selected" : "")} onClick={() => applyEffect(3)}>
          <WarningIcon fill={selectIcon === 3 ? white : blue} />
        </div>
      </div>
    )
  }

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">

      <section className="section1">
        <div className="custom-container">
          <div className="left">
            <h1 className="title">
              Dapp gateways have never been easier
            </h1>
            <h2 className="subtitle">
              Connect your application to Algorand while allowing your user to interact with it in the simplest and most secure way.
            </h2>
            <div className="connect-button">
              <div className="button-blue scale-on-hover">Get Connect</div>
            </div>
          </div>
          <div className="right">
            <img src="../static/img/myalgo-connect-tour.gif" className="gif" />
          </div>
        </div>
        <h1 className="message">
          An intuitive UI inspired by users
        </h1>
      </section>

      <section className="section2">
        <div className="custom-container">
          <h2 className="message">
            Connect your application to Algorand while allowing your user to interact with it in the simplest and most secure way.
          </h2>

          <div ref={ref}>
            <div className={clsx("feature-section")}>
              <div className={clsx("left", "from-left", selectIcon === 0 && slideIn ? "appear" : "", selectIcon !== 0 && slideOut ? "disappear" : "", shouldDisplay === 0 ? "" : "hidden")}>
                <img src="../static/img/hardware.svg" alt="" />
              </div>
              <div className={clsx("left", "from-left", selectIcon === 1 && slideIn ? "appear" : "", selectIcon !== 1 && slideOut ? "disappear" : "", shouldDisplay === 1 ? "" : "hidden")}>
                <img src="../static/img/extension.svg" alt="" />
              </div>

              <div className={clsx("left", "from-left", selectIcon === 2 && slideIn ? "appear" : "", selectIcon !== 2 && slideOut ? "disappear" : "", shouldDisplay === 2 ? "" : "hidden")}>
                <img src="../static/img/feature.svg" alt="" />
              </div>

              <div className={clsx("left", "from-left", selectIcon === 3 && slideIn ? "appear" : "", selectIcon !== 3 && slideOut ? "disappear" : "", shouldDisplay === 3 ? "" : "hidden")}>
                <img src="../static/img/warning.svg" alt="" />
              </div>

              <div className="right">
                {renderIconSection()}

                <div className={clsx("from-right", selectIcon === 0 && slideIn ? "appear" : "", selectIcon !== 0 && slideOut ? "disappear" : "", shouldDisplay === 0 ? "" : "hidden")}>
                  <h1 className="title">
                    Hardware wallet support
                  </h1>
                  <h2 className="subtitle">
                    Connect your users to their favorite hardware wallets like Ledger Nano X or S, giving them the tools to interact with your dApp in the most secure way.
                  </h2>
                </div>

                <div className={clsx("from-right", selectIcon === 1 && slideIn ? "appear" : "", selectIcon !== 1 && slideOut ? "disappear" : "", shouldDisplay === 1 ? "" : "hidden")}>
                  <h1 className="title">
                    Forget about extensions
                  </h1>
                  <h2 className="subtitle">
                    My Algo Connect is managed in the user’s browser without any backend service, downloads, extensions, or browser plugins providing a simpler intuitive interaction.
                  </h2>
                </div>

                <div className={clsx("from-right", selectIcon === 2 && slideIn ? "appear" : "", selectIcon !== 2 && slideOut ? "disappear" : "", shouldDisplay === 2 ? "" : "hidden")}>
                  <h1 className="title">
                    Advanced Features
                  </h1>
                  <h2 className="subtitle">
                    Power up your dApp’s UX with My Algo Connect advanced features like bulk and group transactions, full transaction overviews, warning alerts, and more. Multiple transactions can be signed at the same time, giving your users the best experience.
                  </h2>
                </div>

                <div className={clsx("from-right", selectIcon === 3 && slideIn ? "appear" : "", selectIcon !== 3 && slideOut ? "disappear" : "", shouldDisplay === 3 ? "" : "hidden")}>
                  <h1 className="title">
                    Warning Alerts
                  </h1>
                  <h2 className="subtitle">
                    Users will receive clear and visible alerts, raising their awareness when they rekey or empty an account, modify or destroy an asset, update or delete an application from the ledger. Your users have never felt safer interacting with the blockchain.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section3">
        <div ref={ref} className={clsx("from-bottom", "custom-container", inView ? "appear" : "")}>
          <h1 className="title">
            Simplify your work, while giving a great experience to your dApp users
          </h1>
          <h2 className="subtitle">
            Compatible with all browsers, including Safari and smartphones.
          </h2>
        </div>
      </section>

      <section className="section4">
        <div className="custom-container">
          <div className="row1">
            <h1 className="title">
              An SDK for developers, <br />
              by developers
            </h1>
            <h2 className="subtitle">
              Start connecting your users with <br />
              your dApp in three simple steps.
            </h2>
          </div>
          <div className="code-section">
            <Connect
              connection={connection}
              onComplete={onCompleteConnect}
            />
            <ParamsProvider params={params}>
              <AccountsProvider accounts={accounts}>
                <SignTransaction callbackSignedTxn={callbackSignedTxn} />
              </AccountsProvider>
            </ParamsProvider>
            <SendTransaction txToSend={txToSend} />
          </div>
        </div>
      </section>

      <section className="section5">
        <div className="custom-container">
          <div className="row1">
            <div className="left">
              <img src="../static/img/connect-icon.svg" alt="" className="logo" />
            </div>
            <div className="right">
              <div className="title">
                <div className="first-name">Visit MyAlgo Wallet </div>
                <a className="link scale-on-hover" href="https://mywalgo.com/home"> here </a>
              </div>
              <div className="icons">
                <div className="aligned">
                  <a href="https://github.com/randlabs/myalgo-connect"><img src="../static/img/github-icon.svg" alt="" className="scale-on-hover" /></a>
                  <a href="https://twitter.com/myalgo_"><img src="../static/img/twitter-icon.svg" alt="" className="scale-on-hover" /></a>
                  <a href="https://medium.com/randlabs"><img src="../static/img/mm-icon.svg" alt="" className="scale-on-hover" /></a>
                  <div className="contact-us scale-on-hover">
                    <a href="https://randlabs.io/contact">
                      Contact Us &nbsp; &gt;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row2">
            <div className="right-reserved">
              © 2021 My Algo Connect. All Rights Reserved. 
            </div>
            <a href="https://randlabs.io" className="powered scale-on-hover">
              &nbsp; Powered by Randlabs
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
}
