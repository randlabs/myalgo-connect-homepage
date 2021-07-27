import 'bootstrap/dist/css/bootstrap.min.css';
import 'prismjs/themes/prism.css';
import React from 'react';
import FooterSection from '../../components/commons/footer/footer';
import "./community.scss";
import Layout from '@theme/Layout';
import { AlgoIcon, DiscordIcon } from '../GlobalSvgIcons';

export default function Community() {
    return (
        <Layout title="Hello">
            <div className="community">
                <section className="section1">
                    <div className="custom-container">
                        <div className="left">
                            <h1 className="title">Need some support?  Join the community!</h1>
                            <h2 className="subtitle">The best place to discuss and ask questions to the MyAlgo Connect team and the community of developers building on it is the Algorand Discord channel:</h2>
                            <a href="https://discord.com/channels/491256308461207573/817420411502329896" className="button button-black mt-5">
                                <DiscordIcon fill="white"/>  &nbsp; Discord </a>
                        </div>
                        <div className="right">
                            <img src="../static/img/connect-icon.svg" alt="" className="logo" />
                        </div>
                    </div>
                </section>

                <section className="section2">
                    <div className="custom-container">
                        <div className="row1">
                            <div className="left"><AlgoIcon /></div>
                            <div className="vertical-line"></div>
                            <h2 className="right">Another place to post questions is the Algorand Forum, you can take advantage of this forum to ask questions not only related to MyAlgo Connect but also about the AlgoSDK or any other topics.</h2>
                        </div>
                    </div>
                    <a href="https://forum.algorand.org/" className="button button-black">Algorand Forum</a>
                </section>

                <section className="section3">
                    <div className="custom-container">
                        <h1>We want to hear from you. </h1>
                        <h1> Share feedback or report a bug:</h1>
                        <div className="message">
                            <a href="https://randlabs.io/contact" className="button button-blue button-blue-2">Drop a Message</a>
                        </div>
                    </div>
                </section>

                <FooterSection />
            </div>
        </Layout>
    );
}
