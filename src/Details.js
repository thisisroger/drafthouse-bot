import React from "react";
import axios from "axios";
import ErrorBoundary from "./ErrorBoundary";

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      movieTitle: this.props.match.params.slug
    };
  }
  
  fetchData() {
    axios
      .get("https://feeds.drafthouse.com/adcService/showtimes.svc/market/0800/")
      .then(res => {
        const films = res.data.Market.Dates[0].Cinemas[0].Films;

        const filmList = [];

        /* Necessary to build the Available Showtimes url */
        films.forEach(function(element) {
          let movieData = {
            filmSlug: element.FilmSlug,
            filmSessionId: element.Series[0].Formats[0].Sessions[0].SessionId
          };
          filmList.push(movieData);
        });

        let filmAPI = [];

        filmList.forEach(function(element) {
          console.log(element);
          let showtimeURL =
            "https://drafthouse.com/s/mother/v1/page/showtime/showtime-by-session/0801/" +
            element.filmSessionId;
          filmAPI.push(showtimeURL);
        });

        async function getAllData(filmAPI) {
          let networkRequestPromises = filmAPI.map(fetchData);
          return await Promise.all(networkRequestPromises);
        }

        function fetchData(url) {
          return axios
            .get(url)
            .then(function(response) {
              return {
                success: true,
                data: response.data
              };
            })
            .catch(function(error) {
              return { success: false };
            });
        }

        getAllData(filmAPI)
          .then(resp => {
            let payload = [];

            let movieTitle = this.state.movieTitle;

            resp.forEach(function(item) {
              console.log(item);
              if (item.data.data.film.slug === movieTitle) {
                payload.push(item.data.data);
              }
            });

            this.setState({ payload: payload, isLoading: false });
            console.log(this.state.payload); // Object w/ prop of payload
          })
          .catch(e => {
            console.log(e);
          });
      });
  }

  componentDidMount() {
    this.setState({ isLoading: true }, this.fetchData);
  }

  render() {
    const { payload, isLoading } = this.state;
    console.log(this.props);

    if (isLoading) {
      return <h1>loading...</h1>;
    }

    return (
      <div className="details">
        <h1>Hello {payload[0].film.title}</h1>
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
