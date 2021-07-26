import 'bootstrap/dist/css/bootstrap.min.css';
import 'prismjs/themes/prism.css';
import React from 'react';

export default function Footer() {
  return (
    <section className="section5">
      <div className="custom-container">
        <div className="row1">
          <div className="left">
            <img src="../static/img/connect-icon.svg" alt="" className="logo" />
          </div>
          <div className="right">
            <div className="icons">
              <div className="aligned">
                <a href="https://github.com/randlabs/myalgo-connect/releases"><img src="../static/img/github-icon.svg" alt="" className="scale-on-hover" /></a>
                <a href="https://twitter.com/myalgo_"><img src="../static/img/twitter-icon.svg" alt="" className="scale-on-hover" /></a>
                <a href="https://medium.com/randlabs"><img src="../static/img/mm-icon.svg" alt="" className="scale-on-hover medium" /></a>
                <div className="contact-us scale-on-hover">
                  <a href="https://randlabs.io/contact">
                    Contact Us &nbsp; &gt;
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row2">
          <div className="right-reserved">
            © 2021 My Algo Connect. All Rights Reserved.
        </div>
          <a href="https://randlabs.io" className="powered scale-on-hover">
            &nbsp; Powered by Randlabs
        </a>
        </div>
      </div>
    </section>

  );
}
