import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Film from "./Film";
import { MovieContext } from "./MovieContext";

const ComingSoon = () => {
  const [movies, setMovies] = useContext(MovieContext);
  console.log(movies);

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
    payload.push(item);
  });

  console.log(payload);

  if (!movies.isFetching) {
    return (
      <div className="view">
        <div className="now-playing">
          <h2 className="view__title">Coming Soon</h2>
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
      <ComingSoon {...props} />
    </ErrorBoundary>
  );
}
