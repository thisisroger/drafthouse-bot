import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
import { async } from "q";

export const MovieContext = createContext();

export const MovieProvider = props => {
  const [movies, setMovies] = useState({ films: [], isFetching: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMovies({
          films: [],
          isFetching: true
        });

        let filmDataApiUrl = async function() {
          return await axios.get(
            "https://feeds.drafthouse.com/adcService/showtimes.svc/market/0800/"
          );
        };

        filmDataApiUrl().then(results => {
          let filteredResults = results.data.Market.Dates[0].Cinemas[0].Films;

          let films = filteredResults;
          const filmList = [];

          /* Necessary to build the Available Showtimes url */
          films.forEach(element => {
            let movieData = {
              filmSlug: element.FilmSlug,
              filmSessionId: element.Series[0].Formats[0].Sessions[0].SessionId,
              seatingLow: element.Series[0].Formats[0].Sessions[0].SeatingLow,
              seatsLeft: element.Series[0].Formats[0].Sessions[0].SeatsLeft
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

          async function getAllData(filmAPI_1) {
            let networkRequestPromises = filmAPI_1.map(fetchData);
            return await Promise.all(networkRequestPromises);
          }

          async function fetchData(url_1) {
            return await axios
              .get(url_1)
              .then(function(response) {
                return {
                  success: true,
                  data: response.data
                };
              })
              .catch(error => {
                // Error 😨
                if (error.response) {
                  /*
                   * The request was made and the server responded with a
                   * status code that falls out of the range of 2xx
                   */
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  /*
                   * The request was made but no response was received, `error.request`
                   * is an instance of XMLHttpRequest in the browser and an instance
                   * of http.ClientRequest in Node.js
                   */
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request and triggered an Error
                  console.log("Error", error.message);
                }
                console.log(error.config);
              });
          }
          getAllData(filmAPI)
            .then(resp => {
              let payload = [];

              resp.forEach(item => {
                if (item.data.data) {
                  payload.push(item.data.data);
                }
              });

              setMovies({
                films: payload,
                isFetching: false
              });
            })
            .catch(error => {
              // Error 😨
              if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                console.log(error.request);
              } else {
                // Something happened in setting up the request and triggered an Error
                console.log("Error", error.message);
              }
              console.log(error.config);
            });
        });
      } catch (e) {
        console.log(e);
        setMovies({
          films: ["error"],
          isFetching: false
        });
      }
    };
    fetchData();
  }, []);

  return (
    <MovieContext.Provider value={[movies, setMovies]}>
      {props.children}
    </MovieContext.Provider>
  );
};
