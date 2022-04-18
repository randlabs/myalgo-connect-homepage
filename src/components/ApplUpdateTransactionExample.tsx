import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import AppIndex from "./commons/AppIndex";
import PrismCode from './commons/Code';
import AccountDropdown from "./commons/FromDropdown";
import "./interactive-examples.scss";

const codeV1 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();

const txn = {
    ...params,
    type: "appl",
    from: sender,
    appApprovalProgram: new Uint8Array(Buffer.from("AiADAAEFIjEYEkEAAiNDMRkkEg==", "base64")),
    appClearProgram: new Uint8Array(Buffer.from("AiABASJD", "base64")),
    appOnComplete: 4,
}

const myAlgoConnect = new MyAlgoConnect();
const signedTxn = await myAlgoConnect.signTransaction(txn);
`;

const codeV2 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();

const txn = algosdk.makeApplicationUpdateTxnFromObject({
    suggestedParams: {
        ...params,
    },
    from: sender,
    approvalProgram: new Uint8Array(Buffer.from("AiADAAEFIjEYEkEAAiNDMRkkEg==", "base64")),
    clearProgram: new Uint8Array(Buffer.from("AiABASJD", "base64")),
});

const myAlgoConnect = new MyAlgoConnect();
const signedTxn = await myAlgoConnect.signTransaction(txn.toByte());
`;

function ApplUpdateTransactionExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accounts = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const applProgram = "AiAEAAUEASYDB0NyZWF0b3IMTGFzdE1vZGlmaWVyBUNvdW50IjEYEkEADigxAGcpMQBnKiJnQgApMRkjEkAACjEZJBJAAA5CABgoZDEAEkEAEkIADSkxAGcqKmQlCGdCAAAlQyJDIgBD";
    const appIndex = 17155035;
    const [accountSelected, selectAccount] = useState("");
    const [response, setResponse] = useState();
    const [activeTab, setActiveTab] = useState('1');
    
    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSubmitUpdateAppl = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
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

            const txn = preLoadedData.algosdk.makeApplicationUpdateTxnFromObject({
                suggestedParams: {
                    ...params,
                    fee: 1000,
                    flatFee: true,
                },
                from: accountSelected,
                approvalProgram: new Uint8Array(Buffer.from(applProgram, "base64")),
                clearProgram: new Uint8Array(Buffer.from("AiABASJD", "base64")),
                appIndex: appIndex,
            });

            const signedTxn = await preLoadedData.myAlgoWallet.signTransaction(txn.toByte());
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
                            <Form id="payment-tx" onSubmit={onSubmitUpdateAppl}>
                                <AccountDropdown onSelectAccount={selectAccount} accounts={accounts} />
                                <AppIndex disabled={true} value={appIndex.toString()} onChangeAppIndex={() => { }} />
                                <Button color="primary" block type="submit" className="mt-2" disabled={accounts.length === 0}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                signTransaction() Response
                            </Label>
                            <div className="txn-appl-update-response">
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
                    <div className="mt-4"> The following codes allow you to create and sent to MyAlgo Connect an application update transaction to be sign by the user. There are two alternatives to create it. Pick the one you prefere.</div>
                    <Row className="mt-3">
                        <Col>
                            <Label className="tx-label">
                                Using Algosdk (Recommended)
                            </Label>
                            <PrismCode
                                code={codeV2}
                                language="js"
                            />
                        </Col>
                        <Col className="mt-4">
                            <Label className="tx-label">
                                Another alternative
                            </Label>
                            <PrismCode
                                code={codeV1}
                                language="js"
                            />
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    )
}

export default () => <PreLoadDataContextComponent><ApplUpdateTransactionExample /></PreLoadDataContextComponent>;
