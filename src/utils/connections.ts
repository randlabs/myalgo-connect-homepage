import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');

export {
    algodClient
}