import React, { createContext, useEffect, useState } from "react";

interface PreLoadData {
    algosdk,
    myAlgoWallet,
    algoClient,
    params
}

export const PreLoadDataContext = createContext<PreLoadData>(undefined);

export default function PreLoadDataContextComponent(props: any): JSX.Element {
    const [algosdk, setAlgosdk] = useState();
    const [myAlgoWallet, setMyAlgoWallet] = useState();
    const [algoClient, setAlgoClient] = useState();
    const [params, setParams] = useState();
    let timeoutResolution = null;

    useEffect(() => {
        import("@randlabs/myalgo-connect").then(x => {
            //@ts-ignore
            setMyAlgoWallet(new x.default({ bridgeUrl: "https://dev.myalgo.com/bridge" }));
        });

        import("algosdk").then(x => {
            //@ts-ignore
            setAlgosdk(x);

            let client = new x.Algodv2('', 'https://api.testnet.algoexplorer.io', '');
            //@ts-ignore
            setAlgoClient(client);

            if (timeoutResolution) clearTimeout(timeoutResolution);
            getTransactionParams(client);
        });
    }, []);


    const getTransactionParams = async (client: any) => {
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