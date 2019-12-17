import React from "react";
import ErrorBoundary from "./ErrorBoundary";

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState.isLoading = false;
  }

  render() {
    if (this.state.isLoading) {
      return <h1>loading...</h1>;
    }

    return (
      <div className="details">
        <h1>Hello</h1>
      </div>
    );
  }
}

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
