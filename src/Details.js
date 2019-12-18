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

  buildYouTubeUrl(id) {
    let youtubeUrl = "https://www.youtube.com/embed/";
    console.log(`${youtubeUrl}${id.split("=")[1]}`);
    return `${youtubeUrl}/${id.split("=")[1]}`;
  }

  formatDate(timestamp) {
    //2019-12-14T15:10:00

    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    let daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    let monthStr = timestamp.substring(5, 7);
    let monthInt = parseInt(monthStr, 10);

    let month = months[monthInt - 1];

    let day = timestamp.substring(8, 10);

    let year = timestamp.substring(0, 4);

    let time = timestamp.substring(11, 19);

    let showtimeDateStr = `${month} ${day}, ${year} ${time}`;

    let showtimeDay = new Date(showtimeDateStr);

    let showtimeDayOfWeek = showtimeDay.getDay();

    return daysOfWeek[showtimeDayOfWeek];
  }

  formatShowtime(timestamp) {
    let timeKey = timestamp.indexOf("T");
    let showtimeHour = timestamp.substring(timeKey + 1, timeKey + 3);
    let showtimeMinute = timestamp.substring(timeKey + 4, timeKey + 6);
    let amOrPm = "a";
    let showtime = "";

    if (showtimeHour == 12) {
      showtime = "Noon";
    } else if (showtimeHour > 12) {
      showtimeHour -= 12;
      amOrPm = "p";
      showtime = `${showtimeHour}:${showtimeMinute}${amOrPm}`;
    }

    return showtime;
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
              console.log(item.data.data.sessions);
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
    console.log(payload);

    if (isLoading) {
      return <div className="intro"></div>;
    }

    return (
      <div className="film-expanded">
        <div className="film-expanded__header">
          <div className="film-expanded__aside">
            <img
              className="film-expanded__poster"
              src={payload[0].film.posterImage}
              alt={payload[0].film.title}
            />
          </div>

          <hgroup className="film-expanded__heading">
            <h2 className="film-expanded__title">{payload[0].film.title}</h2>
            <ul className="film-expanded__meta">
              <li>{payload[0].film.rating}</li>
              <li>{payload[0].film.runtimeMinutes}min</li>
              <li>{payload[0].film.year}</li>
            </ul>
            <h4 className="film-expanded__headline">
              {payload[0].film.headline}
            </h4>
            <ul className="film-expanded__people">
              <li>
                <span>Director:</span> {payload[0].film.director}
              </li>
              <li>
                <span>Starring:</span> {payload[0].film.cast}
              </li>
            </ul>
            <ul className="film-expanded__showtimes">
              {payload[0].sessions.map(item => {
                return (
                  <li key={item.sessionId}>
                    {this.formatShowtime(item.showTimeClt)}
                  </li>
                );
              })}
            </ul>
          </hgroup>
        </div>
        <iframe
          className="film-expanded__trailer"
          width="560"
          height="315"
          src={this.buildYouTubeUrl(payload[0].film.trailer)}
          frameBorder="0"
        ></iframe>
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
