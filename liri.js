require("dotenv").config();
var moment = require('moment');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
//var spotify = new Spotify(keys.spotify);

//read command line arguments
var args = process.argv;
args.shift();//remove the path to node from the argument list
args.shift();//remove the path to liri.js from the argument list
var command = args[0];
args.shift();//remove the command from the argument list
//according to the command call the suitable function
switch (command) {
    case 'concert-this':
        concertThis(args);
        break;
    case 'spotify-this-song':
        spotifyThisSong(args);
        break;
    case 'movie-this':
        movieThis(args);
        break;
    case 'do-what-it-says':
        doWhatItSays(args);
        break;
    default:
        reportUnrecognizedCommand();
}

function concertThis(args) {

}
function spotifyThisSong(args) {
    var spotify;
    var track = '';
    if (args.length === 1) {
        var track = args[0];
        spotify = new Spotify(keys.spotify);
        console.log(`You're spotifying This song: ${track}`);
        spotify.search({ type: 'track', query: track }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log(JSON.stringify(data));
        });
    }//end if (args.length === 1)
    else if (args.length === 0) {
        track = 'The Sign';
        spotify = new Spotify(keys.spotify);
        console.log(`You're spotifying This song: ${track}`);
    }//end else if (args.length === 0)
    else {
        console.log("You can't specify more than one song name!!!");
    }//end else
    var spotify = new Spotify(keys.spotify);
}
function movieThis(args) {

}
function doWhatItSays(args) {

}
function doWhatItSays(args) {

}
function reportUnrecognizedCommand() {
    console.log("Unrecognized Command!!!!");
}