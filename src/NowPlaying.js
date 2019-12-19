import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Film from "./Film";
import { MovieContext } from "./MovieContext";

const NowPlaying = () => {
  const [movies, setMovies] = useContext(MovieContext);
  console.log(movies);

  let formatDate = timestamp => {
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
  };

  let formatShowtime = timestamp => {
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
  };
  return (
    <div className="view">
      <div className="now-playing">
        <h2 className="view__title">Today</h2>
        <div className="movie-list">
          {movies.films.map(item => {
            return (
              <Link
                key={item.sessions[0].sessionId}
                to={`/film/${item.film.slug}`}
              >
                <Film
                  poster={item.film.posterImage}
                  title={item.film.title}
                  dateKey={item.sessions[0].showTimeClt}
                  sessions={item.sessions}
                  key={item.sessions[0].sessionId}
                  formatShowtime={formatShowtime}
                  slug={item.film.slug}
                  path={`/details/${item.film.slug}`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <NowPlaying {...props} />
    </ErrorBoundary>
  );
}
