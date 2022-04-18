import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { FormEvent, useContext, useState } from "react";
import { Button, Col, Form, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import Address from "./commons/Address";
import Amount from "./commons/Amount";
import PrismCode from './commons/Code';
import AccountDropdown from "./commons/FromDropdown";
import "./interactive-examples.scss";

const codeV1 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();

const txn1: any = {
    ...params,
    type: "pay",
    from: sender,
    to: receiver1,
    amount: amount
};

const txn2: any = {
    ...params,
    type: "pay",
    from: sender,
    to: receiver2,
    amount: amount
};

const txnsArray = [ txn1, txn2 ];
const groupID = algosdk.computeGroupID(txnsArray)
for (let i = 0; i < 2; i++) txnsArray[i].group = groupID;

const myAlgoConnect = new MyAlgoConnect();
const signedTxns = await myAlgoConnect.signTransaction(txnsArray);
`;

const codeV2 = `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://node.testnet.algoexplorerapi.io', '');
const params = await algodClient.getTransactionParams().do();

const txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: {
        ...params,
    },
    from: sender,
    to: receiver1, 
    amount: amount1
});

const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: {
        ...params,
    },
    from: sender,
    to: receiver2, 
    amount: amount2
});

const txnsArray = [ txn1, txn2 ];
const groupID = algosdk.computeGroupID(txnsArray)
for (let i = 0; i < 2; i++) txnsArray[i].group = groupID;

const myAlgoConnect = new MyAlgoConnect();
const signedTxns = await myAlgoConnect.signTransaction(txnsArray.map(txn => txn.toByte()));
`;

function GroupedPaymentExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accounts = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [accountSelected, selectAccount] = useState("");
    const [receiver1, setReceiver1] = useState("");
    const [receiver2, setReceiver2] = useState("");
    const [amount1, setAmount1] = useState(0);
    const [amount2, setAmount2] = useState(0);
    const [response, setResponse] = useState();
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSubmitGroupTxns = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        try {
            if (accounts.length === 0 || receiver1.length === 0 || receiver2.length === 0) return;

            const params = {
                fee: 1000,
                firstRound: 15249878,
                flatFee: false,
                genesisHash: "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=",
                genesisID: "testnet-v1.0",
                lastRound: 15250878,
            }

            const txn1 = preLoadedData.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...params,
                    fee: 1000,
                    flatFee: true,
                },
                from: accountSelected,
                to: receiver1,
                amount: preLoadedData.algosdk.algosToMicroalgos(amount1),
            });

            const txn2 = preLoadedData.algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                suggestedParams: {
                    ...params,
                    fee: 1000,
                    flatFee: true,
                },
                from: accountSelected,
                to: receiver2,
                amount: preLoadedData.algosdk.algosToMicroalgos(amount2),
            });

            const txArr = [txn1, txn2];
            const groupID = preLoadedData.algosdk.computeGroupID(txArr);

            for (let i = 0; i < 2; i++) {
                txArr[i].group = groupID;
            }

            const signedTxns = await preLoadedData.myAlgoWallet.signTransaction(txArr.map(txn => txn.toByte()));

            setResponse(signedTxns);
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
                            <Form id="payment-tx" onSubmit={onSubmitGroupTxns}>
                                <AccountDropdown onSelectAccount={selectAccount} accounts={accounts} />
                                <Address label="To for Transaction 1" onChangeAddress={setReceiver1} />
                                <Amount amount={amount1} label="Amount for Transaction 1" onChangeAmount={setAmount1} />
                                <Address label="To for Transaction 2" onChangeAddress={setReceiver2} />
                                <Amount amount={amount2} label="Amount for Transaction 2" onChangeAmount={setAmount2} />
                                <Button color="primary" block type="submit" className="mt-2" disabled={accounts.length === 0}>
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                signTransaction() Response
                            </Label>
                            <div className="response-base txn-group-response">
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
                    <div className="mt-4"> The following codes allow you to create and sent to MyAlgo Connect 2 transactions grouped to be sign by the user. There are two alternatives to make it. Pick the one you prefere.</div>
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

export default () => <PreLoadDataContextComponent><GroupedPaymentExample /></PreLoadDataContextComponent>;
