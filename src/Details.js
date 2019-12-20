import React, { useContext } from "react";
import ErrorBoundary from "./ErrorBoundary";

import { MovieContext } from "./MovieContext";

const Details = props => {
  const [movies, setMovies] = useContext(MovieContext);

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

  let payload = [];

  let formatUrlSlug = path => {
    return path.split("/film/")[1];
  };

  movies.filmApi.forEach(item => {
    if (item.film.slug === formatUrlSlug(props.location.pathname)) {
      payload.push(item);
    }
  });

  console.log(payload);

  if (!movies.isFetching) {
    return (
      <div>
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
                      {formatShowtime(item.showTimeClt)}
                    </li>
                  );
                })}
              </ul>
            </hgroup>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading</div>;
  }
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <Details {...props} />
    </ErrorBoundary>
  );
}
