import React, { useState } from "react";
import { useInView } from 'react-intersection-observer';
import { Button, Col, Container, Row } from "reactstrap";
import { algodClient } from '../../utils/connections';
import PrismCode from '../commons/Code';

const code = `
import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2('', 'https://api.testnet.algoexplorer.io', '');

const response = await algodClient.sendRawTransaction(signedTxn.blob).do();
`;

export default function SendTransaction(props: any): JSX.Element {
    const [response, setResponse] = useState("");
    const { ref, inView, entry } = useInView({ threshold: 0.5 });
    const onClickToSend = async (): Promise<void> => {
        try {
            const res = await algodClient.sendRawTransaction(props.txToSend.blob).do();
            setResponse(res);
        } catch (err) {
            console.error(err);
        }
    }

    return <Container className="mt-5 pb-5">
        <Row>
            <Col xs="12" lg="4">
                <div ref={ref} className={`from-small ${inView ? "appear" : ""}`}>
                    <h1>Send Transaction</h1>
                    <Button color="primary" block onClick={onClickToSend} disabled={!props.txToSend}>
                        Send!
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

                {response &&
                    <div ref={ref} className={`from-small appear mt3`}>
                        <PrismCode
                            code={response ? JSON.stringify(response, null, 1) : ""}
                            language="js"
                            plugins={["response"]}
                        />
                    </div>
                }
            </Col>
        </Row>
    </Container>
}