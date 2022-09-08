import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, { useContext, useState } from "react";
import { Button, Col, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from '../context/preLoadedData';
import PrismCode from './commons/Code';
import AccountDropdown from "./commons/FromDropdown";
import Note from "./commons/Note";
import "./interactive-examples.scss";

const tealSignCode =
    `
import MyAlgoConnect from '@randlabs/myalgo-connect';

const myAlgoConnect = new MyAlgoConnect();

const data = new Uint8Array([...]);
const signer = 'MKJ...';

const signature = await myAlgoConnect.signBytes(data, signer);
`

function SignBytesExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const accountslist = ExecutionEnvironment.canUseDOM && window.sharedAccounts && Array.isArray(window.sharedAccounts) ? window.sharedAccounts : [];
    const [accounts, setAccount] = useState(accountslist);
    const [accountSelected, selectAccount] = useState("");
    const [data, setData] = useState<Uint8Array>(new Uint8Array());
    const [response, setResponse] = useState<string>("");
    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab: React.SetStateAction<string>) => {
        if (activeTab !== tab) setActiveTab(tab);
    }

    const onSignData = async () => {
        try {
            const signature = await preLoadedData.myAlgoWallet.signBytes(data, accountSelected);

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
                            <Note label="Data" onChangeNote={setData} />
                            <Button color="primary" block className="mt-2" onClick={onSignData}  disabled={accounts.length === 0}>
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
                                Sign a bytes message
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

export default () => <PreLoadDataContextComponent><SignBytesExample /></PreLoadDataContextComponent>;