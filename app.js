require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
app.get('/', (req, res, next) => res.render('home'));
app.get("/artist-search", (req, res, next) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(artistsSearchResult => {
      // console.log('The received data from the API: ', artistsSearchResult.body.artists.items);
      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render('artist-search-results.hbs', { artistSearchResult: artistsSearchResult.body.artists.items })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(albumsSearchResult => {
      // console.log("check the bloody structure: " + albumsSearchResult.body.items[0].artists[0].name);
      res.render("albums.hbs", { albumsSearchResult: albumsSearchResult.body.items })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});


app.get('/view-tracks/:albumId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(tracksSearchResult => {
      console.log("check the bloody structure: " + tracksSearchResult.body.items);
      res.render("view-tracks", { tracksSearchResult: tracksSearchResult.body.items })
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
});