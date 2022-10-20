import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { WalletTransaction } from '@randlabs/myalgo-connect';

import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import AppIndex from "./commons/AppIndex";
import PrismCode from './commons/Code';
import AccountDropdown from "./commons/FromDropdown";
import Note from "./commons/Note";
import "./interactive-examples.scss";

const codeV2 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();

const txn = algosdk.makeApplicationOptInTxnFromObject({
    suggestedParams: {
        ...params,
    },
    from: sender,
    appIndex: appIndex,
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

function ApplOptInExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accounts = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [accountSelected, selectAccount] = useState("");
    const [appIndex, setAppIndex] = useState("14241387");
    const [note, setNote] = useState<Uint8Array | undefined>();
    const [response, setResponse] = useState<any>();
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSubmitOptInTx = async (event: any): Promise<void> => {
        event.preventDefault();

        try {
            if (accounts.length === 0) return;

            const params = {
                fee: 1000,
                firstRound: 15249878,
                flatFee: false,
                genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
                genesisID: "testnet-v1.0",
                lastRound: 15250878,
            }

            const txn = preLoadedData.algosdk.makeApplicationOptInTxnFromObject({
                suggestedParams: {
                    ...params,
                    fee: 1000,
                    flatFee: true,
                },
                from: accountSelected,
                appIndex: parseInt(appIndex),
                note: note
            });

            const txns: WalletTransaction[] = [
                {
                    txn: Buffer.from(txn.toByte()).toString('base64')
                }
            ];

            const result = await preLoadedData.myAlgoWallet.signTxns(txns);
            setResponse(result);
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
                            <Form id="payment-tx" onSubmit={onSubmitOptInTx}>
                                <AccountDropdown onSelectAccount={selectAccount} accounts={accounts} />
                                <AppIndex onChangeAppIndex={setAppIndex} />
                                <Note onChangeNote={setNote} />
                                <Button color="primary" block type="submit" className="mt-2" disabled={accounts.length === 0}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                signTxns() Response
                            </Label>
                            <div className="response-base txn-optin-response">
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
                    {accounts.length === 0 && 
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

export default () => <PreLoadDataContextComponent><ApplOptInExample /></PreLoadDataContextComponent>;
