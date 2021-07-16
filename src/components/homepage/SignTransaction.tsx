import algosdk from "algosdk";
import React, { useContext } from "react";
import { useInView } from 'react-intersection-observer';
import { Button, Col, Container, Row } from "reactstrap";
import { AccountsContext } from "../../context/accountsContext";
import { ParamsContext } from "../../context/paramsContext";
import { connection } from '../../utils/connections';
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
    const params = useContext(ParamsContext);
    const accounts = useContext(AccountsContext);

    const account = accounts && accounts.length > 0 ? accounts[0].address : "";
    const { ref, inView, entry } = useInView({ threshold: 0.5 });

    const onClickPaymentTx = async (): Promise<void> => {

        try {
            if (!params || !account) return;

            const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...params,
                    fee: 1000,
                    flatFee: true,
                },
                from: account,
                to: account,
                amount: 1000,
            });

            const signedTxn = await connection.signTransaction(txn.toByte());

            props.callbackSignedTxn(signedTxn);
        }
        catch (err) {
            console.error(err);
        }
    }

    return <Container className="mt-5 pb-5">
        <Row>
            <Col xs="12" lg="4">
                <div ref={ref} className={`from-small ${inView ? "appear" : ""}`}>
                    <h1>Sign transaction</h1>
                    <Button color="primary" block onClick={onClickPaymentTx} disabled={accounts.length === 0}>
                        Sign!
                    </Button>
                </div>
            </Col>
            <Col xs="12" lg="8">
                <div ref={ref} className={`from-left ${inView ? "appear" : ""}`}>
                    <PrismCode
                        code={code}
                        language="js"
                    />
                </div>
            </Col>
        </Row>
    </Container>
}