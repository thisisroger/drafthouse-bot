import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Film from "./Film";
import { MovieContext } from "./MovieContext";

const NowPlaying = () => {
  const [movies, setMovies] = useContext(MovieContext);

  let formatDate = timestamp => {
    //2019-12-14T15:10:00

    let time = timestamp.substring(0, 10);
    console.log(time);
    return time;
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

  let payload = [];

  movies.filmApi.forEach(item => {
    let todayDateKey = formatDate(movies.filmApi[0].sessions[0].showTimeClt);

    if (formatDate(item.sessions[0].showTimeClt) === todayDateKey) {
      payload.push(item);
    }
  });

  console.log(payload);

  if (!movies.isFetching) {
    return (
      <div className="view">
        <div className="now-playing">
          <h2 className="view__title">Today</h2>
          <div className="movie-list">
            {payload.map(item => {
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
  } else {
    return <div>Loading</div>;
  }
};

export default function DetailsErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <NowPlaying {...props} />
    </ErrorBoundary>
  );
}
