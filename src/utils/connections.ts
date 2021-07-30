import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

export {
    algodClient
}