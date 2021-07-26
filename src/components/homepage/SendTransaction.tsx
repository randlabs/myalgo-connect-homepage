import React, { useState } from "react";
import { useInView } from 'react-intersection-observer';
import { algodClient } from '../../utils/connections';
import PrismCode from '../commons/Code';

const code = `
import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
`;

export default function SendTransaction(props: any): JSX.Element {
    const [response, setResponse] = useState("");
    const { ref, inView, entry } = useInView({ threshold: 1, triggerOnce: true });
    const onClickToSend = async (): Promise<void> => {
        try {
            const res = await algodClient.sendRawTransaction(props.txToSend.blob).do();
            setResponse(res);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div ref={ref} className={`custom-container from-small ${inView ? "appear" : ""}`}>
            <div className="function">
                <div>
                    <h1 className="title">
                        Send it
                   </h1>
                    <h2 className="subtitle">
                        Now you only need to send the
                        user’s approved transaction to
                        the Algorand blockchain and voilà!
                    </h2>
                    <div className={`button button-blue scale-on-hover ${props.txToSend ? "" : "disabled"}`} onClick={onClickToSend}>
                        Send!
                    </div>
                </div>
            </div>
            <div>
                <div ref={ref} className={`code-max-width from-right ${inView ? "appear" : ""}`}>
                    <PrismCode
                        code={code}
                        language="js"
                    />
                </div>

                <div ref={ref} className={`code-max-width from-bottom ${response ? "appear" : "hidden"} mt-2`}>
                    <PrismCode
                        code={response ? JSON.stringify(response, null, 1) : ""}
                        language="js"
                        plugins={["response"]}
                    />
                </div>
            </div>
        </div>
    )
}