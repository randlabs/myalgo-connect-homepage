import MyAlgo, { Accounts } from '@randlabs/myalgo-connect';
import React, { FC, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button, Col, Container, Row } from 'reactstrap';
import PrismCode from '../commons/Code';
import "./homepage.scss";

interface ConnectProps {
    connection: MyAlgo;
    onComplete(accounts: Accounts[]): void;
}

const installCode = `npm install @randlabs/myalgo-connect`;

const code = `
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const myAlgoConnect = new MyAlgoConnect();

const accountsSharedByUser = await myAlgoConnect.connect();
`;

const Connect: FC<ConnectProps> = (props: ConnectProps): JSX.Element => {

    const [accounts, setAccounts] = useState<Accounts[]>([]);
    const { ref, inView, entry } = useInView({ threshold: 0.5 });

    const connectToMyAlgo = async (): Promise<void> => {
        try {
            const { connection, onComplete } = props;

            const accounts = await connection.connect();

            setAccounts(accounts);
            onComplete(accounts);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <Container className="mt-5">
            <Row className="connect-content">
                <Col xs="12" lg="4" >
                    <div ref={ref} className={`from-small ${inView ? "appear" : ""}`}>
                        <h1 >Connect</h1>
                        <Button
                            className="button-margin"
                            color="primary"
                            block
                            onClick={connectToMyAlgo}>
                            Connect
                    </Button>
                    </div>
                </Col>
                <Col xs="12" lg="8">
                    <div ref={ref} className={`from-left ${inView ? "appear" : ""}`}>
                        <div className="mb-3 install-code">
                            <PrismCode
                                code={installCode}
                                language="js"
                            />
                        </div>

                        <PrismCode
                            code={code}
                            language="js"
                        />
                    </div>

                </Col>
            </Row>
        </Container>
    );
}

export default Connect;
