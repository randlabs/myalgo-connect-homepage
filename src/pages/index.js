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
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <div className={styles.buttons}>
          <span className="rotate"></span>MyAlgo Connect HOMEPAGE Goes HERE.
        </div>
      </div>
    </header>
  );
}

let timeoutResolution = null;

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const [params, setParams] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [txToSend, setTxToSend] = useState();

  const onCompleteConnect = (accounts) => {
    setAccounts(accounts);
  };

  const callbackSignedTxn = (txToSendParm) => {
    setTxToSend(txToSendParm);
  }

  const getTransactionParams = async () => {
    try {
      const params = await algodClient.getTransactionParams().do();
      console.log(params)
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


  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <Connect
        connection={connection}
        onComplete={onCompleteConnect}
      />
      <ParamsProvider params={params}>
        <AccountsProvider accounts={accounts}>
          <SignTransaction callbackSignedTxn={callbackSignedTxn} />
        </AccountsProvider>
      </ParamsProvider>
      <SendTransaction txToSend={txToSend}/>
    </Layout>
  );
}
