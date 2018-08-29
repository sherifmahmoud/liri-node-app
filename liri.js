require("dotenv").config();
var moment = require('moment');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
//var spotify = new Spotify(keys.spotify);
var beautify = require("json-beautify");

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
    console.log('Waiting for application ID from bandsintown.com.....');
}
function spotifyThisSong(args) {
    var track = '';
    if (args.length === 1) {
        track = args[0];
    }//end if (args.length === 1)
    else if (args.length === 0) {
        track = 'The Sign';
    }//end else if (args.length === 0)
    else {
        console.log("You can't specify more than one song name!!!");
        return;
    }//end else

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
function movieThis(args) {

}
function doWhatItSays(args) {

}
function doWhatItSays(args) {

}
function reportUnrecognizedCommand() {
    console.log("Unrecognized Command!!!!");
}