import { addTopSongsToPlaylist } from './PlaylistAddition';
import User from '../models/User';
import Playlist from '../models/Playlist';
var express = require('express');
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_CREATE_URI;
var stateKey = 'spotify_auth_state';
var AuthController = require('../controllers/AuthController');

router.get('/login', function(req, res) {
  var state = 'PARTY_PLAYLIST_SPOTIFY';
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-modify-public';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        state: state,
      }) +
      `&redirect_uri=${redirect_uri}`
  );
});

router.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  res.clearCookie(stateKey);
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    },
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    json: true,
  };

  request.post(authOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;

      await AuthController.createOrGetUser(
        access_token,
        refresh_token,
        async user => await createPlaylist(user, res)
      );
    } else {
      res.redirect(process.env.APP_URL + 'error');
    }
  });
});

const createPlaylist = async (user, res) => {
  var options = {
    url: `https://api.spotify.com/v1/users/${user.s_id}/playlists`,
    headers: { Authorization: 'Bearer ' + user.s_access_token },
    json: true,
    body: {
      name: `Party Playlist ${new Date().getDate()}/${new Date().getMonth() +
        1}`,
    },
  };

  request.post(options, async (error, response, playlistResponse) => {
    if (error || response.statusCode !== 201) {
      await AuthController.refreshUserToken(user, () =>
        createPlaylist(user, res)
      );
      return;
    }
    const playlist = await Playlist.create({
      id: playlistResponse.id,
      owner_id: user.id,
    });

    await playlist.addAttendee(user);
    await addTopSongsToPlaylist(null, playlist, user, 50);

    res.redirect(`${process.env.APP_URL}create/${playlist.id}`);
  });
};

export default router;
