import React from "react";

import "./Footer.css";

const Footer = () => (
  <>
    <div className="footer-block"></div>
    <div className="footer">
      <div className="footer-container">
        <p>
          Copyright® 2021 all rights reserved{" "}
        
        </p>
        <p>
          제작: <i className="fas fa-heartbeat" />
          <a
            className="profile"
            href="https://linerate.tistory.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LINERATE
          </a>
        </p>
      </div>
    </div>
  </>
);

export default Footer;
