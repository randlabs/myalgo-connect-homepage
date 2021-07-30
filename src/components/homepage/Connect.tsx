import { Accounts } from '@randlabs/myalgo-connect';
import React, { FC, useContext, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PreLoadDataContext } from '../../context/preLoadedData';
import PrismCode from '../commons/Code';
import "./homepage.scss";

interface ConnectProps {
    onComplete(accounts: Accounts[]): void;
}

const installCode = `npm install @randlabs/myalgo-connect`;

const code = `
import MyAlgoConnect from '@randlabs/myalgo-connect';
 
const myAlgoConnect = new MyAlgoConnect();

const accountsSharedByUser = await myAlgoConnect.connect();
`;

const Connect: FC<ConnectProps> = (props: ConnectProps): JSX.Element => {
    const preLoadedData = useContext(PreLoadDataContext);
    const [accounts, setAccounts] = useState<Accounts[]>([]);
    const { ref, inView, entry } = useInView({ threshold: 1, triggerOnce: true });

    const connectToMyAlgo = async (): Promise<void> => {
        try {
            const { onComplete } = props;

            const accounts = await preLoadedData.myAlgoWallet.connect();

            setAccounts(accounts);
            onComplete(accounts);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div ref={ref} className={`custom-container from-small ${inView ? "appear" : ""}`}>
            <div className="function">
                <h1 className="title">
                    Know your user
                    </h1>
                <h2 className="subtitle">
                    Connect your dApp(s) with
                    the user’s wallet(s).
                    </h2>
                <div className="button button-blue scale-on-hover" onClick={connectToMyAlgo}>
                    Connect
                </div>
            </div>
            <div ref={ref} className={`code-max-width from-right ${inView ? "appear" : ""}`}>
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
        </div>
    );
}

export default Connect;
