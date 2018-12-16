require("dotenv").config();

var liriAction = process.argv[2];
var liriData = process.argv[3];
//console.log(liriAction + " " + liriData);

var axios = require("axios");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");

checkOption(liriAction, liriData);

function checkOption(liriAction, liriData) {
  if (liriAction === "concert-this") {
    // Run the axios.get function...
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          liriData +
          "/events?app_id=99ba5a2274cf279df970ff5b9976febf"
      )
      .then(function(response) {
        var concertData = response.data[0];
        console.log("\n------------------------------------------------------------------\n")
        console.log("Name of the venue: " + concertData.venue.name + "\n");
        console.log("Venue location: " + concertData.venue.city +", " + concertData.venue.country + "\n");
        console.log("Date of the Event: " + moment(concertData.datetime).format("MM/DD/YYYY") + "\n");
        
      })
      .catch(function(error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  } else if (liriAction === "spotify-this-song") {
    spotify.search({ type: "track", query: liriData, limit: 1 }, function(err,data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }
      // If there are no results the program will show "The Sign" data
      if (data.lenght === 0) {
        spotify.search({ type: "track", query: "The Sign", limit: 1 }, function(
          err,
          data
        ) {
          return console.log("Error occurred: " + err);
        });
      }
      console.log("\n------------------------------------------------------------------\n")
      console.log("El nombre de la canción es: "+data.tracks.items[0].name + "\n");
      console.log("Link del Preview de la canción: "+data.tracks.items[0].href + "\n");
      console.log("El nombre del album es: "+data.tracks.items[0].album.name + "\n");
      console.log("El nombre del artista es: "+data.tracks.items[0].artists[0].name + "\n");
    });
  } else if (liriAction === "movie-this") {
    // aqui checo si esta vacío o no el campo del nombre de la película y si no esta vacío busco la movie, en caso contrario mando la de Mr. Nobody
    if (liriData !=null) {
      axios
        .get("http://www.omdbapi.com/?apikey=15fd16a6&t=" + liriData)
        .then(function(response) {
          console.log("\n------------------------------------------------------------------\n")
          console.log("El título de la película es: " + response.data.Title + "\n");
          console.log("El año en el que salió fue: " + response.data.Released + "\n");
          console.log("El IMBD rating fue: " + response.data.imdbRating + "\n");
          console.log(
            "La clasificación en Rottens tomatoes fue de: " +
              response.data.Ratings[1].Value + "\n"
          );
          console.log("La película fue producida en: " + response.data.Country + "\n");
          console.log("El idioma de la pelícual es: " + response.data.Language + "\n");
          console.log("La trama de la película es: " + response.data.Plot + "\n");
          console.log("Los actores de la película son: " + response.data.Actors + "\n");
        })
        .catch(function(error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    } else {
      // si no pone la película le mandamos a la de afuerzas la de Mr. Nobody
      axios
        .get("http://www.omdbapi.com/?apikey=15fd16a6&t=Mr.+Nobody")
        .then(function(response) {
          console.log("\n------------------------------------------------------------------\n")
          console.log("El título de la película es: " + response.data.Title + "\n");
          console.log("El año en el que salió fue: " + response.data.Released + "\n");
          console.log("El IMBD rating fue: " + response.data.imdbRating + "\n");
          console.log(
            "La clasificación en Rottens tomatoes fue de: " +
              response.data.Ratings[1].Value + "\n"
          );
          console.log("La película fue producida en: " + response.data.Country + "\n");
          console.log("El idioma de la pelícual es: " + response.data.Language + "\n");
          console.log("La trama de la película es: " + response.data.Plot + "\n");
          console.log("Los actores de la película son: " + response.data.Actors + "\n");
        })
        .catch(function(error) {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    }
  } else if (liriAction === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }
      var dataArr = data.split(",");
      var liriAction = dataArr[0];
      var liriData = dataArr[1];
      checkOption(liriAction, liriData);
    });
  }
}
