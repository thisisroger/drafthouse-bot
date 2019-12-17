import React from "react";
import { render } from "react-dom";
import {BrowserRouter as Router, Route} from 'react-router-dom'
import NowPlaying from "./NowPlaying";
import Details from "./Details";
import Header from "./Header";
import Footer from "./Footer";
import "./App.scss";

class App extends React.Component {
  render() {
    return (
      <div className="frame">
        <div className="frame__inner">
          <Header />
          <Router>
          <Route path="/" exact strict component={NowPlaying} />
            <Route path="/film/:slug" exact strict component={Details} />
          </Router>
          <Footer />
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
