import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from "@docusaurus/useBaseUrl"
import Layout from '@theme/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import clsx from 'clsx';
import 'prismjs/themes/prism.css';
import React, { useContext, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import FooterSection from '../components/commons/footer/footer';
import "../components/commons/footer/footer.scss";
import Connect from '../components/homepage/Connect';
import SendTransaction from '../components/homepage/SendTransaction';
import SignTransaction from '../components/homepage/SignTransaction';
import AccountsProvider from "../context/accountsContext";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import { sleep } from '../utils/algorand';
import './index.scss';

export default function Home() {
  const preLoadedData = useContext(PreLoadDataContext);
  const { siteConfig } = useDocusaurusContext();
  const [accounts, setAccounts] = useState([]);
  const [txToSend, setTxToSend] = useState();
  const [selectIcon, setSelectedIcon] = useState(0);
  const [slideIn, setSlideIn] = useState(true);
  const [slideOut, setSlideOut] = useState(false);
  const [shouldDisplay, setShouldDisplay] = useState(0);
  const { ref, inView, entry } = useInView({ threshold: 0.5 });
  const blue = "#245EC7";
  const white = "white";

  const onCompleteConnect = (accounts) => {
    setAccounts(accounts);
  };

  const callbackSignedTxn = (txToSendParm) => {
    setTxToSend(txToSendParm);
  }

  const applyEffect = async (toDisplay: number) => {
    if (toDisplay === selectIcon) return;
    setSlideOut(true);
    setSlideIn(false);
    setSelectedIcon(toDisplay);

    sleep(400).then(() => {
      setShouldDisplay(toDisplay);
    })

    sleep(500).then(() => {
      setSlideIn(true)
    })
  }

  const renderIconSection = () => {
    return (
      <div className="icons">
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 0 ? "selected" : "")} onClick={() => applyEffect(0)}>
          <svg width="47" height="47" viewBox="0 0 47 47" fill={selectIcon === 0 ? white : blue} xmlns="http://www.w3.org/2000/svg">
            <path d="M0.621314 37.6431L9.71906 46.7409C10.0645 47.0864 10.6403 47.0864 11.0146 46.7409L19.4502 38.3053L21.5231 40.3782C21.8686 40.7237 22.4444 40.7237 22.8186 40.3782L45.6828 17.385C47.4391 15.6 47.439 12.7209 45.6828 10.9647L36.2972 1.57905C34.5122 -0.205951 31.6331 -0.20595 29.8769 1.57905L7.01277 24.5723C6.66728 24.9178 6.66728 25.4936 7.01277 25.8679L9.08567 27.9408L0.6501 36.3764C0.275825 36.7218 0.275828 37.2977 0.621314 37.6431ZM11.8495 39.2266L10.0358 41.0404L8.74019 39.7448L10.554 37.931L11.8495 39.2266ZM7.84769 35.2248L9.14326 36.5203L7.32946 38.3341L6.0339 37.0385L7.84769 35.2248Z" />
          </svg>
        </div>
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 1 ? "selected" : "")} onClick={() => applyEffect(1)}>
          <svg width="41" height="50" viewBox="0 0 41 50" fill={selectIcon === 1 ? white : blue} xmlns="http://www.w3.org/2000/svg">
            <path d="M23.5352 48.5352L23.5352 43.8282C23.5352 42.0403 22.0807 40.5859 20.293 40.5859C18.5053 40.5859 17.0508 42.0403 17.0508 43.8282L17.0508 48.5352C17.0508 49.3441 16.3949 50 15.5859 50L1.46484 50C0.655859 50 -2.1569e-06 49.3441 -2.12154e-06 48.5352L-1.50429e-06 34.4141C-1.46892e-06 33.6051 0.655859 32.9492 1.46484 32.9492L6.17187 32.9492C7.95957 32.9492 9.41406 31.4947 9.41406 29.707C9.41406 27.9193 7.95967 26.4648 6.17187 26.4648L1.46484 26.4648C0.65586 26.4648 -1.12815e-06 25.809 -1.09278e-06 25L-4.75532e-07 10.8789C-4.4017e-07 10.0699 0.65586 9.41406 1.46484 9.41406L14.1211 9.41406L14.1211 6.17187C14.1211 2.76875 16.8898 -1.03579e-06 20.293 -8.87034e-07C23.6961 -7.38278e-07 26.4648 2.76875 26.4648 6.17187L26.4648 9.41406L39.1211 9.41406C39.9301 9.41406 40.5859 10.0699 40.5859 10.8789L40.5859 23.5352L40.5859 35.8789L40.5859 48.5352C40.5859 49.3441 39.9301 50 39.1211 50L25 50C24.191 50 23.5352 49.3441 23.5352 48.5352Z" />
          </svg>
        </div>
        <div className={clsx("feature-icon icon-container", "scale-on-hover", selectIcon === 2 ? "selected" : "")} onClick={() => applyEffect(2)}>
          <svg width="68" height="63" viewBox="0 0 68 63" fill={selectIcon === 2 ? white : blue} xmlns="http://www.w3.org/2000/svg">
            <path d="M8.9389 14.9146C8.96826 25.8747 9.00046 36.8348 9.03039 47.795C9.03406 48.9815 9.24207 50.3089 11.1874 50.9573C26.4486 56.2546 40.8206 43.494 56.082 48.7915C57.2696 49.272 58.2303 48.844 58.2268 47.6575C58.1967 36.6974 58.1896 25.7368 58.1356 14.7769C58.1269 13.018 57.1661 12.0952 55.9782 11.6145C40.7172 6.31708 26.3448 19.0776 11.0833 13.78C9.89576 13.3 8.93547 13.7279 8.9389 14.9146ZM13.3256 47.3957C13.3176 44.3719 13.3084 41.348 13.3004 38.3242C16.6031 39.0936 19.6695 39.2073 23.0388 38.8803C23.0467 41.9041 23.0558 44.9282 23.0637 47.9518C19.6949 48.2785 16.6283 48.1654 13.3256 47.3957ZM53.8655 24.3811C53.876 27.817 53.8848 31.2531 53.8943 34.6889C50.4263 33.8665 47.1729 33.7941 43.6406 34.2008C43.6494 37.2248 43.6578 40.2487 43.6658 43.2725C40.1696 43.8315 36.7768 44.7133 33.365 45.6487C33.3569 42.6251 33.3478 39.601 33.3396 36.5771C36.7515 35.6419 40.1446 34.7596 43.6406 34.2008C43.6309 30.765 43.6216 27.3289 43.6121 23.8931C47.1445 23.4867 50.3976 23.559 53.8655 24.3811ZM43.5863 14.6886C43.5951 17.7567 43.6035 20.8251 43.612 23.8935C40.1403 24.4478 36.7722 25.3211 33.3847 26.25C33.3762 23.1816 33.3676 20.1133 33.3592 17.0449C36.7464 16.1158 40.1148 15.243 43.5863 14.6886ZM33.3116 26.2698C33.3205 29.7056 33.3302 33.1416 33.3395 36.5775C29.9291 37.5091 26.5404 38.367 23.0389 38.8801C23.029 35.4443 23.0195 32.0083 23.0101 28.5726C26.5112 28.059 29.9008 27.2015 33.3116 26.2698ZM22.9245 19.375C22.9333 22.4431 22.9417 25.5115 22.9504 28.58C19.6025 28.8994 16.553 28.7818 13.2721 28.0164C13.2634 24.9479 13.2548 21.8797 13.2459 18.8116C16.527 19.5769 19.5769 19.6947 22.9245 19.375Z" />
          </svg>
        </div>
        <div className={clsx("icon-container", "scale-on-hover", selectIcon === 3 ? "selected" : "")} onClick={() => applyEffect(3)}>
          <svg width="46" height="41" viewBox="0 0 46 41" fill={selectIcon === 3 ? white : blue} xmlns="http://www.w3.org/2000/svg">
            <path d="M0.919561 30.8367L17.0353 3.39941C19.6676 -1.13314 26.3241 -1.13314 28.9469 3.39941L45.0721 30.8367C47.7044 35.3692 44.4283 41 39.1163 41L6.93219 41C1.62024 41 -1.71274 35.3134 0.919561 30.8367ZM23.0006 34.9132C24.4019 34.9132 25.5666 33.7684 25.5666 32.391C25.5666 31.0135 24.402 29.8687 23.0006 29.8687C21.5992 29.8687 20.4346 31.0135 20.4914 32.4561C20.4251 33.7684 21.656 34.9132 23.0006 34.9132ZM20.6618 18.6072C20.7754 20.5617 20.8985 22.5068 21.0122 24.4613C21.069 25.0942 21.069 25.6712 21.069 26.2948C21.1258 27.3279 21.9496 28.1283 23.0006 28.1283C24.0516 28.1283 24.8659 27.3837 24.9322 26.3507C25.1026 23.3072 25.2825 20.3197 25.453 17.2763C25.5098 16.4759 25.5666 15.6661 25.6329 14.8657C25.6329 13.5441 24.8754 12.4552 23.6445 12.1108C22.4135 11.8223 21.1921 12.3994 20.6618 13.5441C20.4819 13.9443 20.4251 14.3445 20.4251 14.8099C20.4819 16.085 20.605 17.3507 20.6618 18.6072Z" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <Layout
      title="MyAlgo Connect Documentation"
      description={`${siteConfig.tagline}`}>

      <div className="homepage">
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
                <a href="/docs/introduction"><div className="button-blue scale-on-hover">Get Started</div></a>
              </div>
            </div>
            <div className="right">
              <img src={useBaseUrl("/img/myalgo-connect-tour.gif")} className="gif" />
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
                  <img src={useBaseUrl("/img/hardware.svg")} alt="" />
                </div>
                <div className={clsx("left", "from-left", selectIcon === 1 && slideIn ? "appear" : "", selectIcon !== 1 && slideOut ? "disappear" : "", shouldDisplay === 1 ? "" : "hidden")}>
                  <img src={useBaseUrl("/img/extension.svg")} alt="" />
                </div>

                <div className={clsx("left", "from-left", selectIcon === 2 && slideIn ? "appear" : "", selectIcon !== 2 && slideOut ? "disappear" : "", shouldDisplay === 2 ? "" : "hidden")}>
                  <img src={useBaseUrl("/img/feature.svg")} alt="" />
                </div>

                <div className={clsx("left", "from-left", selectIcon === 3 && slideIn ? "appear" : "", selectIcon !== 3 && slideOut ? "disappear" : "", shouldDisplay === 3 ? "" : "hidden")}>
                  <img src={useBaseUrl("/img/warning.svg")} alt="" />
                </div>

                <div className="right">
                  {renderIconSection()}

                  <div className={clsx("from-right", "message-item", selectIcon === 0 && slideIn ? "appear" : "", selectIcon !== 0 && slideOut ? "disappear" : "", shouldDisplay === 0 ? "" : "hidden")}>
                    <h1 className="title">
                      Hardware wallet support
                  </h1>
                    <h2 className="subtitle">
                      Connect your users to their favorite hardware wallets like Ledger Nano X or S, giving them the tools to interact with your dApp in the most secure way.
                  </h2>
                  </div>

                  <div className={clsx("from-right", "message-item", selectIcon === 1 && slideIn ? "appear" : "", selectIcon !== 1 && slideOut ? "disappear" : "", shouldDisplay === 1 ? "" : "hidden")}>
                    <h1 className="title">
                      Forget about extensions
                  </h1>
                    <h2 className="subtitle">
                      My Algo Connect is managed in the user’s browser without any backend service, downloads, extensions, or browser plugins providing a simpler intuitive interaction.
                  </h2>
                  </div>

                  <div className={clsx("from-right", "message-item", selectIcon === 2 && slideIn ? "appear" : "", selectIcon !== 2 && slideOut ? "disappear" : "", shouldDisplay === 2 ? "" : "hidden")}>
                    <h1 className="title">
                      Advanced Features
                  </h1>
                    <h2 className="subtitle">
                      Power up your dApp’s UX with My Algo Connect advanced features like bulk and group transactions, full transaction overviews, warning alerts, and more. Multiple transactions can be signed at the same time, giving your users the best experience.
                  </h2>
                  </div>

                  <div className={clsx("from-right", "message-item", selectIcon === 3 && slideIn ? "appear" : "", selectIcon !== 3 && slideOut ? "disappear" : "", shouldDisplay === 3 ? "" : "hidden")}>
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
          <div ref={ref} className={clsx("from-small", "custom-container", inView ? "appear" : "")}>
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
              <PreLoadDataContextComponent>
                <Connect onComplete={onCompleteConnect} />
                <AccountsProvider accounts={accounts}>
                  <SignTransaction callbackSignedTxn={callbackSignedTxn} />
                </AccountsProvider>
                <SendTransaction txToSend={txToSend} />
              </PreLoadDataContextComponent>
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </Layout>
  );
}
