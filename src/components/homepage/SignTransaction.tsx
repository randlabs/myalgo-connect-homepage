import React, { useContext } from "react";
import { useInView } from 'react-intersection-observer';
import { AccountsContext } from "../../context/accountsContext";
import { PreLoadDataContext } from "../../context/preLoadedData";
import PrismCode from '../commons/Code';

const code = `
import algosdk from "algosdk";

const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  suggestedParams: params,
  from: sender,
  to: receiver,
  amount: 1000 // 0.001 Algo
});

const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
`;

export default function SignTransaction(props: any): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accounts = useContext(AccountsContext);
    const account = accounts && accounts.length > 0 ? accounts[0].address : "";
    const { ref, inView } = useInView({ threshold: 1, triggerOnce: true });

    const onClickPaymentTx = async (): Promise<void> => {
        try {
            if (!preLoadedData.params || !account) return;

            const txn = preLoadedData.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...preLoadedData.params,
                    fee: 1000,
                    flatFee: true,
                },
                from: account,
                to: account,
                amount: 1000,
            });

            const signedTxn = await preLoadedData.myAlgoWallet.signTransaction(txn.toByte());

            props.callbackSignedTxn(signedTxn);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div ref={ref} className={`custom-container from-small ${inView ? "appear" : ""}`}>
            <div className="function">
                <div>
                    <h1 className="title">
                        Let him sign
                    </h1>
                    <h2 className="subtitle">
                        Time for the user to review and sign
                        your transaction(s) interacting with
                        My Algo Connect’s friendly UI.
                     </h2>
                    <div className={`button button-blue scale-on-hover ${accounts.length > 0 ? "": "disabled"}`} onClick={onClickPaymentTx}>
                        Sign!
                    </div>
                </div>
            </div>
            <div ref={ref} className={`code-max-width from-right ${inView ? "appear" : ""}`}>
                <PrismCode
                    code={code}
                    language="js"
                />
            </div>
        </div>
        
    )
}