require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index');
  });

app.get('/artist-search', (req, res) => {
    const searchTerm = req.query.artist;
    spotifyApi
      .searchArtists(searchTerm)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('artist-search-results', { artists: data.body.artists.items,searchTerm: searchTerm });
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
  });

  app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
    spotifyApi
      .getArtistAlbums(artistId)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('albums', { albums: data.body.items });
      })
      .catch(err => console.log('The error while searching albums occurred: ', err));
  });

  app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
    spotifyApi
      .getAlbumTracks(albumId)
      .then(data => {
        console.log('The received data from the API: ', data.body);
        res.render('tracks', { tracks: data.body.items });
      })
      .catch(err => console.log('The error while searching tracks occurred: ', err));
  });

  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

app.listen(3001, () => console.log('Express Spotify project running on port 3000 Sir!  🎧 🥁 🎸 🔊'));
