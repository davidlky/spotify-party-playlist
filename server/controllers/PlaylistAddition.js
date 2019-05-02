import User from '../models/User';
import Playlist from '../models/Playlist';
var express = require('express');
var router = express.Router();
var request = require('request'); // "Request" library
var querystring = require('querystring');
require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_PLAYLIST_URI;
var stateKey = 'spotify_auth_state';
var AuthController = require('../controllers/AuthController');

router.get('/login/:playlist_id', function(req, res) {
  var state = req.params.playlist_id;
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
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
  var playlist_id = req.query.state || null;
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
        async user => {
          var playlist = await Playlist.findOne({ where: { id: playlist_id } });
          if (!playlist) {
            res.redirect(process.env.APP_URL + 'error');
            return;
          }
          var owner = await User.findOne({ where: { id: playlist.owner_id } });
          AuthController.refreshUserToken(owner, () =>
            clearPlaylist(owner, playlist_id, async () => {
              await playlist.addAttendee(user);

              var attendees = await playlist.getAttendees();

              var num_songs = Math.ceil(100 / attendees.length);
              attendees.forEach(attendee =>
                addTopSongsToPlaylist(
                  attendee.id === user.id ? res : null,
                  playlist,
                  attendee,
                  num_songs
                )
              );
            })
          );
        }
      );
    } else {
      res.redirect(process.env.APP_URL + 'error');
    }
  });
});

const clearPlaylist = async (user, playlist_id, callback) => {
  var options = {
    url: 'https://api.spotify.com/v1/playlists/' + playlist_id,
    headers: {
      Authorization: 'Bearer ' + user.s_access_token,
    },
    qs: {
      fields: 'tracks.items(track(uri))',
    },
    json: true,
  };

  request.get(options, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var options = {
        url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
        headers: {
          Authorization: 'Bearer ' + user.s_access_token,
        },
        body: {
          tracks: body.tracks.items.map(el => el.track),
        },
        json: true,
      };

      request.delete(options, async (error, response, body) => {
        if (!error && response.statusCode === 200) {
          await callback();
        } else {
          throw new Error('Fuck my life');
        }
      });
    } else {
      throw new Error('Fuck my life');
    }
  });
};

export const addTopSongsToPlaylist = async (
  res,
  playlist,
  user,
  num_songs,
  retry = true
) => {
  // use the attendee access token to get the top songs
  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    qs: {
      time_range: 'short_term',
      limit: num_songs,
    },
    headers: {
      Authorization: 'Bearer ' + user.s_access_token,
    },
    json: true,
  };

  request.get(options, async (error, response, body) => {
    console.log(error, response.statusCode);
    if (!error && response.statusCode === 200) {
      var track_uris = body.items.map(item => item.uri);
      var names = body.items.map(item => item.name);
      await addToPlaylist(res, playlist, track_uris, names);
    } else if (retry === true) {
      await AuthController.refreshUserToken(user, () =>
        addTopSongsToPlaylist(res, playlist, user, num_songs, false)
      );
      return;
    } else {
      if (res) {
        res.redirect(process.env.APP_URL + 'error');
      }
    }
  });
};

const addToPlaylist = async (res, playlist, track_uris, names) => {
  // use the owner access token to add the top songs to the playlist
  var owner = await User.findOne({ where: { id: playlist.owner_id } });

  await AuthController.refreshUserToken(owner, (_, access_token) => {
    var options = {
      url: `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
      json: true,
      body: {
        uris: track_uris,
      },
    };

    request.post(options, async (error, response, body) => {
      if (res) {
        if (!error && response.statusCode === 201) {
          res.redirect(
            `${process.env.APP_URL}playlist/${playlist.id}/success?songs=` +
              encodeURIComponent(names.join('*')) +
              '&owner=' +
              playlist.owner_id
          );
        } else {
          res.redirect(process.env.APP_URL + 'error');
        }
      }
    });
  });
};

export default router;
