---
id: quickstart
sidebar_position: 1
---

# Quick Start

This section will cover a common dev flow to request the user's public wallet data, create a transaction, request the user to sign it, and finally send it to the network.

### Install

```jsx
npm install @randlabs/myalgo-connect
```

A **minified version** can be found in our **[Github Repository](https://github.com/randlabs/myalgo-connect/releases)**.

### Connect a user’s wallet

In order to interact with the wallet, the user has to first grant permission to the site to perform operations, as well as which accounts it can operate with.

To do so, you need to call a `connect()` method. Most Dapp workflow would invoke this method inside a function that has been triggered by a click event. A new browser window will open requesting permission to share the user’s public wallet data to the website and a selection of the account(s) the user wishes to connect to the Client application. If the user accepts, it will return an array with the account addresses previously selected, if not, the `connect()` method will throw an error.

```jsx
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const myAlgoConnect = new MyAlgoConnect();

const accountsSharedByUser = await myAlgoConnect.connect()
```

### Create and sign transactions

There are two options to create transactions accepted by MyAlgo Connect:

* Use **[AlgoSDK](https://www.npmjs.com/package/algosdk)** EncodedTransaction (Supported in MyAlgo 2.0) - **Recommended**
* Use MyAlgo Connect’s Json transaction types. For more information about this visit the MyAlgo Connect **[Github Repository](https://github.com/randlabs/myalgo-connect)**.

```jsx
import algosdk from "algosdk";
  
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');

const params = await algodClient.getTransactionParams().do();

const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  suggestedParams: {
      ...params,
  },
  from: sender,
  to: receiver,
  amount: amount,
  note: note
});
```

Once you have created the transaction, it can be signed by the user by simply sending it to MyAlgo Connect. For more information on the `signTxns`/`signTransaction` methods, check the [API section](myalgo-connect-api#signtxns)

```jsx
const [ signedTxn ] = await myAlgoConnect.signTxns({
  txn: Buffer.from(txn.toByte()).toString('base64')
});
```

### Send Transactions to the Network

After the user has signed the transaction(s), the object signedTxn should have the final transaction with signature data on it. You can now send it to the network:

```jsx
import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2(“”, 'https://node.testnet.algoexplorerapi.io', '');

const txBytes = Buffer.from(signedTxn, 'base64')

const response = await algodClient.sendRawTransaction(txBytes).do();
```

More examples are available in the [Interactive Examples](../interactive-examples/connect) section
