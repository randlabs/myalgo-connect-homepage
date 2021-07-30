import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import React, { MouseEvent, useContext, useState } from "react";
import { Button, Col, Label, Row } from "reactstrap";
import PreLoadDataContextComponent, { PreLoadDataContext } from "../context/preLoadedData";
import PrismCode from './commons/Code';

const code = `
import MyAlgoConnect from '@randlabs/myalgo-connect';

const myAlgoConnect = new MyAlgoConnect();

const accounts = await myAlgoConnect.connect({ shouldSelectOneAccount: true });
`;

function ConnectExample(): JSX.Element {
    const preLoadedData = useContext(PreLoadDataContext);
    const [accounts, setAccounts] = useState<[]>([]);

    const onClick = async (e: MouseEvent): Promise<void> => {
        e.preventDefault();
        try {
            if (ExecutionEnvironment.canUseDOM) {
                const sharedAccounts = await preLoadedData.myAlgoWallet.connect();
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
    )
}

export default () => <PreLoadDataContextComponent><ConnectExample /></PreLoadDataContextComponent>;