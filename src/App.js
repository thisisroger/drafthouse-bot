import React from "react";
import { render } from "react-dom";
import NowPlaying from "./NowPlaying";
import Header from "./Header";
import Footer from "./Footer";
import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <div className="frame">
        <div className="frame__inner">
          <Header />
          <NowPlaying />
          <Footer />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
