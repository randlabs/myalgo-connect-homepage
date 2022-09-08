import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk, { SuggestedParams } from "algosdk";
import React, { createContext, useEffect, useState } from "react";

interface PreLoadData {
    algosdk,
    myAlgoWallet: MyAlgoConnect,
    algoClient: algosdk.Algodv2,
    params: SuggestedParams
}

export const PreLoadDataContext = createContext<PreLoadData>(undefined);

export default function PreLoadDataContextComponent(props: any): JSX.Element {
    const [algosdk, setAlgosdk] = useState();
    const [myAlgoWallet, setMyAlgoWallet] = useState<MyAlgoConnect | undefined>();
    const [algoClient, setAlgoClient] = useState<algosdk.Algodv2 | undefined>();
    const [params, setParams] = useState<SuggestedParams | undefined>();
    let timeoutResolution = null;

    useEffect(() => {
        import("@randlabs/myalgo-connect").then(x => {
            //@ts-ignore
            setMyAlgoWallet(new x.default({ bridgeUrl: "https://wallet.myalgo.com/bridge" }));
        });

        import("algosdk").then(x => {
            //@ts-ignore
            setAlgosdk(x);

            let client = new x.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');
            //@ts-ignore
            setAlgoClient(client);

            if (timeoutResolution) clearTimeout(timeoutResolution);
            getTransactionParams(client);
        });
    }, []);


    const getTransactionParams = async (client: algosdk.Algodv2) => {
        try {
            //@ts-ignore
            const params = await client.getTransactionParams().do();
            setParams(params);
        }
        catch (err) {
            console.error(err);
        }
        timeoutResolution = setTimeout(() => getTransactionParams(client), 100000);
    }

    return <PreLoadDataContext.Provider value={{ algosdk, myAlgoWallet, algoClient, params }}>{props.children}</PreLoadDataContext.Provider>;
}