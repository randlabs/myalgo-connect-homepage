import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { useContext, useState } from "react";
import { Button, Col, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import Address from "./commons/Address";
import Amount from "./commons/Amount";
import PrismCode from './commons/Code';
import SenderDropdown from "./commons/FromDropdown";
import Note from "./commons/Note";
import "./interactive-examples.scss";

const codeV2 =
    `
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const algodClient = new algosdk.Algodv2("",'https://api.testnet.algoexplorer.io', '');
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

const myAlgoConnect = new MyAlgoConnect();

const lsig = algosdk.makeLogicSig(new Uint8Array(Buffer.from(compiledTeal, "base64")));
lsig.sig = await myAlgoConnect.signLogicSig(lsig.logic, sender);

const signedTxn = algosdk.signLogicSigTransaction(txn, lsig);
`

const statelessTeal =
    `
txn Amount
int 0
>=
txn Fee
int 1000
==
&&
txn Type
byte "pay"
==
txn TxID
byte b32 $REPLACE_FOR_TXID
==
&&
&&
`

function PaymentWithTealExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accountslist = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [accounts, setAccount] = useState(accountslist);
    const [accountSelected, selectAccount] = useState("");
    const [note, setNote] = useState<Uint8Array | undefined>();
    const [receiver, setReceiver] = useState("");
    const [amount, setAmount] = useState(0);
    const [response, setResponse] = useState();
    const [activeTab, setActiveTab] = useState('1');
    const [teal, setTeal] = useState("");
    const [preparedTxn, setTxn] = useState(null);

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onPrepareTransaction = (): void => {
        try {
            if (accounts.length === 0 || receiver.length === 0) return;

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
                    fee: 1000,
                    flatFee: true,
                },
                from: accountSelected,
                to: receiver, note,
                amount: preLoadedData.algosdk.algosToMicroalgos(amount),
            });

            const rTeal = statelessTeal.replace("$REPLACE_FOR_TXID", `${txn.txID()}`);
            preLoadedData.algoClient.compile(rTeal).do().then(compiledTeal => {
                setTxn(txn);
                setTeal(compiledTeal.result);
            })
        }
        catch (err) {
            console.error(err)
            setResponse(JSON.stringify(err, null, 4));
        }
    }

    const onSubmitSignTeal = () => {
        try {
            if (preparedTxn === null || teal.length === 0) return;

            const lsig = preLoadedData.algosdk.makeLogicSig(new Uint8Array(Buffer.from(teal, "base64")));
            preLoadedData.myAlgoWallet.signLogicSig(lsig.logic, accountSelected).then(sig => {
                lsig.sig = sig;
                const signedTxn = preLoadedData.algosdk.signLogicSigTransaction(preparedTxn, lsig);
                setResponse(signedTxn);
                setTxn(null);
                setTeal("");
            });
        }
        catch (err) {
            console.error(err)
            setResponse(JSON.stringify(err, null, 4));
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
                            <SenderDropdown onSelectSender={selectAccount} disabled={!!preparedTxn} accounts={accounts} />
                            <Address label="To" onChangeAddress={setReceiver} disabled={!!preparedTxn} />
                            <Amount amount={amount} onChangeAmount={setAmount} disabled={!!preparedTxn} />
                            <Note onChangeNote={setNote} disabled={!!preparedTxn} />
                            {preparedTxn === null || teal.length === 0 ?
                                <Button color="primary" block className="mt-2" disabled={accounts.length === 0} onClick={onPrepareTransaction}>
                                    Prepare Teal
                                </Button>
                                : <Button color="primary" block className="mt-2" onClick={onSubmitSignTeal}>
                                    Submit
                                </Button>
                            }
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                Response
                        </Label>
                            <div className="response-base txn-payment-response">
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
                                Clear Response
                        </Button>
                        </Col>
                    </Row>
                    {accounts.length === 0 &&
                        <div className="error-connect mt-3"> In order to run this example, you need to execute connect() method. </div>
                    }
                </TabPane>
                <TabPane tabId="2">
                    <Row className="mt-3">
                        <Col>
                            <Label className="tx-label">
                                Sign stateless teal
                            </Label>
                            <PrismCode
                                code={codeV2}
                                language="js"
                            />
                        </Col>
                        <Col className="mt-2">
                            <Label className="tx-label">
                                Teal to sign
                            </Label>
                            <PrismCode
                                code={statelessTeal}
                                language="js"
                            />
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    )
}

export default () => <PreLoadDataContextComponent><PaymentWithTealExample /></PreLoadDataContextComponent>;