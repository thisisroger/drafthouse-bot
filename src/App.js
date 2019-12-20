import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NowPlaying from "./NowPlaying";
import ComingSoon from "./ComingSoon";
import Details from "./Details";
import Header from "./Header";
import Footer from "./Footer";
import "./App.scss";
import { MovieProvider } from "./MovieContext";

class App extends React.Component {
  render() {
    return (
      <MovieProvider>
        <div className="frame">
          <div className="frame__inner">
            <Header />
            <Router>
              <Route path="/" exact strict component={NowPlaying} />
              <Route path="/coming-soon" exact strict component={ComingSoon} />
              <Route path="/film/:slug" exact strict component={Details} />
            </Router>
            <Footer />
          </div>
        </div>
      </MovieProvider>
    );
  }
}

render(<App />, document.getElementById("root"));
