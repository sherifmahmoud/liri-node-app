require("dotenv").config();
var moment = require('moment');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var beautify = require("json-beautify");
var request = require('request');

//read command line arguments
var args = process.argv;
args.shift();//remove the path to node from the argument list
args.shift();//remove the path to liri.js from the argument list
var command = args[0];

args.shift();//remove the command from the argument list
var argument = args.join(' ');
//according to the command call the suitable function
//now args are just the arguments we care about without node and the liri.js file
switch (command) {
    case 'concert-this':
        concertThis(argument);
        break;
    case 'spotify-this-song':
        spotifyThisSong(argument);
        break;
    case 'movie-this':
        movieThis(argument);
        break;
    case 'do-what-it-says':
        doWhatItSays(argument);
        break;
    default:
        reportUnrecognizedCommand();
}

function concertThis(args) {
    console.log('Waiting for application ID from bandsintown.com.....');
}
function spotifyThisSong(track) {
    console.log("Inside spotifyThisSong() Track: " + track);
    var spotify = new Spotify(keys.spotify);
    spotify.search({ type: 'track', query: track }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tracks = data['tracks'].items;
        console.log(`Found ${tracks.length} tracks`);
        tracks.forEach(outputTrackInfo);
    });
}

function outputTrackInfo(track, index) {
    console.log(`Track ${index + 1} =====================================================================`);
    var artists = track.album.artists;
    artists_text = '';//a string containing artists separated by comma if more than one
    if (artists.length > 1) {
        artists_text = artists[0].name;//start with the first artist
        for (var i = 1; i < artists.length; i++) {
            artists_text += ', '; //add a comma
            artists_text += artists[i].name;
        }
    } else {
        artists_text = artists[0].name;
    }
    console.log(`Artists: ${artists_text}`);
    console.log(`Song Name: "${track.name}"`);
    console.log(`Preview Link: ${track.preview_url}`);
    var album = track.album;
    var albumName = '';
    if (album.album_type === 'single') {
        albumName = "N/A (Single)";
    } else {
        albumName = album.name;
    }
    console.log(`Album: ${albumName}`);

}

function movieThis(movieName) {
    console.log("Inside movieThis() Movie: " + movieName);
    //prepare url
    var url = `http://www.omdbapi.com/?apikey=${keys.omdb.key}&t=${movieName}&type=movie&r=json`;
    //send request and handle response
    request(url, function (error, response, body) {
        body = JSON.parse(body);
        if (!error) {
            console.log(`*Title: ${body.Title}`);
            console.log(`*Year: ${body.Year}`);
            console.log(`*IMDB Rating: ${body.imdbRating}`);
            console.log(`*Rotten Tomatoes Rating:`);
            console.log(`Country: ${body.Country}`);
            console.log(`Language: ${body.Language}`);
            console.log(`Plot: ${body.Plot}`);
            console.log(`Actors: ${body.Actors}`);
        } else {
            console.log('error:', error); // Print the error if one occurred  
        }


    });

}
function doWhatItSays(args) {

}
function doWhatItSays(args) {

}
function reportUnrecognizedCommand() {
    console.log("Unrecognized Command!!!!");
}