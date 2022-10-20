import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { WalletTransaction } from '@randlabs/myalgo-connect';
import React, { FormEvent, useContext, useState } from "react";
import { Button, Col, Form, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import Address from "./commons/Address";
import Amount from "./commons/Amount";
import PrismCode from './commons/Code';
import SenderDropdown from "./commons/FromDropdown";
import Note from "./commons/Note";
import "./interactive-examples.scss";


const codeV2 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';

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

const txns = [
    {
        txn: Buffer.from(txn.toByte()).toString('base64')
    }
];

const myAlgoConnect = new MyAlgoConnect();
const signedTxn = await myAlgoConnect.signTxns(txns);
`;


function PaymentTransactionExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accounts = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [note, setNote] = useState<Uint8Array | undefined>();
    const [accountSelected, selectAccount] = useState("");
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState(0);
    const [response, setResponse] = useState<any>();
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSubmitPaymentTx = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        try {
            const params = {
                fee: 1000,
                firstRound: 15249878,
                flatFee: false,
                genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
                genesisID: "testnet-v1.0",
                lastRound: 15250878,
            }

            const txn = preLoadedData.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...params,
                },
                from: accountSelected,
                to: receiver, note,
                amount: preLoadedData.algosdk.algosToMicroalgos(amount),
            });

            const txns: WalletTransaction[] = [
                {
                    txn: Buffer.from(txn.toByte()).toString('base64')
                }
            ];

            const signedTxn = await preLoadedData.myAlgoWallet.signTxns(txns);
            setResponse(signedTxn);
        }
        catch (err) {
            console.error(err);
            setResponse(err.message);
        }
    }

    return (
        <div className="interactive-example">
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={activeTab === '1' ? "active active-tab" : ""}
                        onClick={() => { toggle('1'); }}>
                        Form
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={activeTab === '2' ? "active active-tab" : ""}
                        onClick={() => { toggle('2'); }}>
                        Code
                </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Row className="mt-3">
                        <Col xs="12" lg="6" className="mt-2">
                            <Form id="payment-tx" onSubmit={onSubmitPaymentTx}>
                                <SenderDropdown onSelectAccount={selectAccount} accounts={accounts} />
                                <Address label="To" onChangeAddress={setReceiver} />
                                <Amount amount={amount} onChangeAmount={setAmount} />
                                <Note onChangeNote={setNote} />
                                <Button color="primary" className="mt-2" type="submit" disabled={accountSelected.length === 0}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                signTxns() Response
                            </Label>
                            <div className="txn-payment-example-response">
                                <PrismCode
                                    code={response ? JSON.stringify(response, null, 1) : ""}
                                    language="js"
                                    plugins={["response"]}
                                />
                            </div>
                            <Button
                                className="button-margin"
                                color="primary"
                                block
                                disabled={!response}
                                onClick={() => setResponse("")}>
                                Clear Method Response
                            </Button>
                        </Col>
                    </Row>
                    {accountSelected.length === 0 && 
                        <div className="error-connect mt-3"> In order to run this example, you need to execute connect() method. </div>
                    }
                </TabPane>
                <TabPane tabId="2">
                    <div className="mt-4">Example code</div>
                    <Row className="mt-3">
                        <Col>
                            <PrismCode
                                code={codeV2}
                                language="js"
                            />
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    )
}

export default () => <PreLoadDataContextComponent><PaymentTransactionExample /></PreLoadDataContextComponent>;