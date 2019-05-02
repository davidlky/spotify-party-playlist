/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

import PlaylistCreation from './controllers/PlaylistCreation';
import PlaylistAddition from './controllers/PlaylistAddition';
import PlaylistInfo from './controllers/PlaylistInfo';

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

var stateKey = 'spotify_auth_state';

var app = express();

app
  .use(express.static(__dirname + '../build'))
  .use(cors())
  .use(cookieParser());

app.use('/create', PlaylistCreation);
app.use('/playlist', PlaylistAddition);
app.use('/info', PlaylistInfo);

console.log('Listening on 8888');
app.listen(8888);
