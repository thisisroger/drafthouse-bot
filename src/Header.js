import React from "react";
import { render } from "react-dom";
import { Router, Link } from "@reach/router";
import "./styles/components/header.scss";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  render() {
    return (
      <header className="header">
        <img
          className="header__logo"
          src="https://drafthouse.com/assets/img/logo-condensed-black.png"
          alt="Alamo Drafthouse Logo"
        />
        <input
          className="header__search"
          type="text"
          placeholder="Search...."
        />
        <div className="profile"></div>
      </header>
    );
  }
}

export default Header;
