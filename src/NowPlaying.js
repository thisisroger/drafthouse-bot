import React from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import Film from "./Film";

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      payload: []
    };
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

  render() {
    const { payload, isLoading } = this.state;
    const dateKey = payload[0];
    console.log(payload);
    return (
      <div className="view">
        {isLoading ? (
          <div className="intro"></div>
        ) : (
          <div className="now-playing">
            <h2 className="view__title">Today</h2>
            <div className="movie-list">
              {payload.map(item => {
                return (
                  <Link key={item.sessions[0].sessionId} to={`/film/${item.film.slug}`}>
                    <Film
                      poster={item.film.posterImage}
                      title={item.film.title}
                      dateKey={dateKey.sessions[0].showTimeClt.substring(0, 10)}
                      sessions={item.sessions}
                      key={item.sessions[0].sessionId}
                      formatShowtime={this.formatShowtime}
                      slug={item.film.slug}
                      path={`/details/${item.film.slug}`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default NowPlaying;
