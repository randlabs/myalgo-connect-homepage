import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { useContext, useState } from "react";
import { Button, Col, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import Address from "./commons/Address";
import PrismCode from './commons/Code';
import AccountDropdown from "./commons/FromDropdown";
import Note from "./commons/Note";
import "./interactive-examples.scss";

const tealSignCode =
    `
import MyAlgoConnect from '@randlabs/myalgo-connect';

const myAlgoConnect = new MyAlgoConnect();

const data = new Uint8Array([...]);
const contractAddress = '46Q...';
const signer = 'MKJ...';

const signature = await myAlgoConnect.tealSign(data, contractAddress, signer);
`

function TealSignExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accountslist = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [accounts, setAccount] = useState(accountslist);
    const [accountSelected, selectAccount] = useState("");
    const [data, setData] = useState<Uint8Array | undefined>();
    const [contractAddress, setContractAddress] = useState("");
    const [response, setResponse] = useState<string>("");
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSignData = async () => {
        try {
            const signature = await preLoadedData.myAlgoWallet.tealSign(data || [], contractAddress, accountSelected);

            setResponse(Buffer.from(signature).toString('base64'));
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
                            <AccountDropdown onSelectAccount={selectAccount} accounts={accounts} />
                            <Address label="Contract Address" onChangeAddress={setContractAddress} />
                            <Note label="Data" onChangeNote={setData} />
                            <Button color="primary" block className="mt-2" onClick={onSignData}>
                                Sign
                            </Button>
                        </Col>
                        <Col xs="12" lg="6" className="mt-2 mt-xs-2">
                            <Label className="tx-label">
                                Response
                        </Label>
                            <div className="response-base txn-payment-response">
                                <PrismCode
                                    code={response}
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
                                Sign data for teal program
                            </Label>
                            <PrismCode
                                code={tealSignCode}
                                language="js"
                            />
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div>
    )
}

export default () => <PreLoadDataContextComponent><TealSignExample /></PreLoadDataContextComponent>;