require("dotenv").config();
const axios = require("axios");
const keys = require("./keys.js");
const spotify = require('node-spotify-api');
const inquirer = require("inquirer");
const moment = require("moment");
const fs = require("fs");
const divider = "\n------------------------------------------------------------\n\n";

function startProgram() {
    inquirer.prompt([{
        type: "list",
        name: "program",
        message: "Which program would you like to run?",
        choices: ["concert-this", "spotify-this-song", 'movie-this']
    }])
        .then(comm => {
            switch (comm.program) {
                case 'concert-this':
                    inquirer.prompt([{
                        type: "input",
                        name: "artist",
                        message: "What artist would you like to search?"
                    }])
                        .then(data => {
                            var artist = data.artist;
                            if (!artist) {

                            }

                            getConcert(artist);
                        });

                    break;

                case "spotify-this-song":
                    inquirer.prompt([{
                        type: 'input',
                        name: 'song',
                        message: 'What song would you like?'
                    }])
                        .then(data => {
                            let song = data.song;
                            if (!song) {
                                song = 'The Sign';
                            }

                            getSong(song);
                        });

                    break;

                case "movie-this":
                    inquirer.prompt([{
                        type: "input",
                        name: "movie",
                        message: "What movie would you like to search?",

                    }])
                        .then(data => {
                            let movie = data.movie;

                            if (!movie) {
                                movie = "Mr. Nobody";
                            }

                            getMovie(movie);
                        })
            }

        });
};

startProgram();


// let commandOne = process.argv.slice(2).join(" ");
// let value = process.argv.slice(3).join(" ");


function getConcert(concert) {

    let URL = "https://rest.bandsintown.com/artists/" + concert + "/events?app_id=codingbootcamp"

    //console.log(URL);
    axios.get(URL).then(response => {
        let data = response.data;
        let item = data[0];
        let venue = item.venue;

        // let bandData = [

        //     "Venue Name: " + venue.name,
        //     "Venue Location: " + venue.city + venue.country,
        //     "Date of Event: " + moment(item.datetime).format("MMMM Do YYYY"),

        // ].join("\n\n");

        console.log("Venue Name: " + venue.name);
        console.log("Venue Location: " + venue.city + venue.country);
        console.log("Date of Event: " + moment( item.datetime ).format( "MMMM Do YYYY" ) );
        // console.log( item );

        // fs.appendFile("random.txt", bandData + divider, function(err){

        //     if(err) throw(err);
            
        // })
    }, 
    err => {
        console.log(err);
    });
}

function getSong(song) {
    var spotifyApi = new spotify(keys.spotify);
    spotifyApi.search({ type: 'track', query: song, limit: 1 }, (err, data) => {
        let tracks = data.tracks;
        let items = tracks.items;

        let item = items[0];
        let album = item.album;
        let artist = album.artists[0];

        console.log('Artist: ' + artist.name);
        console.log('Song: ' + item.name);
        console.log('Song Url: ' + artist.external_urls.spotify);
        console.log('Album: ' + album.name);

        // fs.appendFile("random.txt")
    });
}


function getMovie(movie) {

    let URL = "http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

    axios.get(URL)
        .then(function (response) {

            // console.log(response.data.Ratings[1].Value);
            let data = response.data;
            let ratings = data.Ratings;
            let rating = ratings[1];

            console.log("Title: " + data.Title);
            console.log("Year: " + data.Year);
            console.log("IMDB Rating: " + data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + rating.Value);
            console.log("Country of Production: " + data.Country);
            console.log("Language: " + data.Language);
            console.log("Plot: " + data.Plot);
            console.log("Actors: " + data.Actors);
        });
};