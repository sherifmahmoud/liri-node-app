require("dotenv").config();
var moment = require('moment');
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var beautify = require("json-beautify");
var request = require('request');
var fs = require('fs');

//read command line arguments
var args = process.argv;
args.shift();//remove the path to node from the argument list
args.shift();//remove the path to liri.js from the argument list
var command = args[0];

args.shift();//remove the command from the argument list
//take the rest of the arguments and put them in one string as a potential multi-word argument
var argument = args.join(' ');

executeCommand(command, argument);

function executeCommand(command, argument) {
    //according to the command call the suitable function
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
            doWhatItSays();
            break;
        default:
            reportUnrecognizedCommand();
    }
}

function concertThis(artist) {
    var url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

    request(url, function (error, response, body) {
        events = JSON.parse(body);

        if (!error) {
            console.log(`Found ${events.length} events`);
            events.forEach(outputEventInfo);
        } else {
            console.log('error:', error); // Print the error if one occurred  
        }
    });
}

function outputEventInfo(event, index) {
    console.log(`Event (${index + 1})`);
    console.log(`Name of the venue: ${event.venue.name}`);
    console.log(`Venue location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}`);
    var date = moment(event.datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY');
    console.log(`Date: ${date}`);
    console.log('===================================================================================');

}

function spotifyThisSong(song) {
    var spotify = new Spotify(keys.spotify);
    if (!song) {
        song = 'The Sign';
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tracks = data['tracks'].items;
        console.log(`Found ${tracks.length} tracks`);
        tracks.forEach(outputTrackInfo);
    });
}

function outputTrackInfo(track, index) {
    console.log(`Track (${index + 1}) =====================================================================`);
    var artists = track.album.artists;
    artists_string = '';//a string containing artists separated by comma if more than one
    if (artists.length > 1) {
        artists_string = artists[0].name;//start with the first artist
        for (var i = 1; i < artists.length; i++) {
            artists_string += ', '; //add a comma
            artists_string += artists[i].name;
        }
    } else {
        artists_string = artists[0].name;
    }
    console.log(`Artists: ${artists_string}`);
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
    if (!movieName) {
        movieName = 'Mr. Nobody';
    }
    //prepare url
    var url = `http://www.omdbapi.com/?apikey=trilogy&t=${movieName}&type=movie&r=json`;
    //send request and handle response
    request(url, function (error, response, body) {
        movie = JSON.parse(body);
        if (!error) {
            console.log(`* Title: ${movie.Title}`);
            console.log(`* Year: ${movie.Year}`);
            console.log(`* IMDB Rating: ${movie.imdbRating}`);
            console.log(`* Rotten Tomatoes Rating:`);
            console.log(`* Country: ${movie.Country}`);
            console.log(`* Language: ${movie.Language}`);
            console.log(`* Plot: ${movie.Plot}`);
            console.log(`* Actors: ${movie.Actors}`);
        } else {
            console.log('error:', error); // Print the error if one occurred  
        }
    });
}

function doWhatItSays() {
    //read the file random.txt line by line
    fs.readFileSync('random.txt').toString().split('\n').forEach(function (line) {
        console.log(line);
        var parts = line.split(',');
        var command = parts[0];
        var argument = parts[1].slice(1, -1);//remove the qoutation marks from around the argument
        executeCommand(command, argument);
    });
}

function reportUnrecognizedCommand() {
    console.log("Unrecognized Command!!!!");
}