import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import React, { MouseEvent, useContext, useState } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from "../context/preLoadedData";
import PrismCode from './commons/Code';

const code = `
import MyAlgoConnect from '@randlabs/myalgo-connect';

const myAlgoConnect = new MyAlgoConnect({ disableLedgerNano: false });

const settings = {
    shouldSelectOneAccount: false,
    openManager: false
};

const accounts = await myAlgoConnect.connect(settings);
`;

function ConnectExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const [accounts, setAccounts] = useState<[]>([]);
    const [shouldSelectOneAccount, setShouldSelectOneAccount] = useState(false);
    const [openManager, setOpenManager] = useState(false);

    const onClick = async (e: MouseEvent): Promise<void> => {
        e.preventDefault();
        try {
            if (ExecutionEnvironment.canUseDOM) {
                const settings = { openManager, shouldSelectOneAccount }
                const sharedAccounts = await preLoadedData.myAlgoWallet.connect(settings);
                setAccounts(sharedAccounts);
                window.sharedAccounts = sharedAccounts;
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const onClearResponse = (): void => {
        setAccounts([]);
    }

    return (
        <div>
            <h5 className="mt-4 title">Params</h5>
            <Row className="mb-4 unlock-buttons">
                <div className={"param"}>
                    <div>shouldSelectOneAccount</div>
                    <input
                        type={"checkbox"}
                        checked={shouldSelectOneAccount}
                        onClick={() => setShouldSelectOneAccount(!shouldSelectOneAccount)} />
                </div>
                <div className={"param"}>
                    <div>openManager</div>
                    <input
                        type={"checkbox"}
                        checked={openManager}
                        onClick={() => setOpenManager(!openManager)} />
                </div>
            </Row>
            <Row className="connect-example-content interactive-example">
                <Col xs="12" lg="6">
                    <Label className="tx-label">
                        Code
                    </Label>
                    <div className="connect-code2">
                        <PrismCode code={code} language="js" />
                    </div>
                    <Button
                        className="button-margin"
                        color="primary"
                        block
                        onClick={onClick}>
                        Connect
                    </Button>
                </Col>
                <Col xs="12" lg="6">
                    <Label className="tx-label">
                        connect() Response
                    </Label>
                    <div className="response-base code-connect-example">
                        <PrismCode
                            code={accounts.length ? JSON.stringify(accounts, null, 1) : ""}
                            language="js"
                            plugins={["response"]}
                        />
                    </div>
                    <Button
                        className="button-margin"
                        color="primary"
                        block
                        disabled={!accounts.length}
                        onClick={onClearResponse}>
                        Clear Method Response
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

export default () => <PreLoadDataContextComponent><ConnectExample /></PreLoadDataContextComponent>;