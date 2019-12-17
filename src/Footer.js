import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import "./styles/components/footer.scss";

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    return (
      <footer className="footer">
        <nav className="nav">
          <a href="/">Today</a>
          <a href="/">Browse</a>
          <a href="/">Theatre</a>
        </nav>
        <div className="control-panel"></div>
        <nav className="nav-actions">
          <a href="/">Victory</a>
          <a href="/">New Alert</a>
        </nav>
      </footer>
    );
  }
}

export default Footer;
