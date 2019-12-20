import React from "react";

const Film = props => {
  const { poster, title, sessions, dateKey, sessionId, formatShowtime } = props;

  return (
    <div key={sessionId} className="movie">
      <div className="movie__header">
        <img className="movie__poster" src={poster} alt={title} />
      </div>
      <div className="ticket">
        <ul className="showtime-list">
          {sessions.map(item => {
            if (item.showTimeClt.substring(0, 10) == dateKey.substring(0, 10)) {
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
