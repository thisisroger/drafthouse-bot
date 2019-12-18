import React from "react";

const Film = props => {
  const {
    poster,
    title,
    sessions,
    dateKey,
    sessionId,
    formatShowtime,
    seatsLeft
  } = props;

  return (
    <div key={sessionId} className="movie">
      <div className="movie__header">
        <img className="movie__poster" src={poster} alt={title} />
      </div>
      <div className="ticket">
        <div className="ticket__header">
          <h2>{title}</h2>
          <h3>Seats Left: {seatsLeft}</h3>
        </div>
        <ul className="showtime-list">
          {sessions.map(item => {
            if (item.showTimeClt.substring(0, 10) == dateKey) {
              return (
                <li className="showtime-list__item" key={item.sessionId}>
                  {formatShowtime(item.showTimeClt)}
                </li>
              );
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default Film;
