import React from "react";
import axios from "axios";

class SearchParams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      movieTitle: "",
      payload: []
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

            resp.forEach(function(item) {
              payload.push(item.data.data);
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

  setFilm(e) {
    this.setState({ movieTitle: e.target.value });
    console.log(this.state.movieTitle);
  }

  render() {
    const { payload, setFilm } = this.state;
    return (
      <div className="search-params">
        <select
          className="header__search"
          onChange={setFilm()}
          onBlur={setFilm}
          id="search-film"
          value={setFilm}
        >
          <option value="">All</option>
          {payload.map(item => {
            return <option key={item.film.slug}>{item.film.title}</option>;
          })}
        </select>
      </div>
    );
  }
}

export default SearchParams;
