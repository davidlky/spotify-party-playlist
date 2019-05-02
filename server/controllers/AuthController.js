import User from '../models/User';
var request = require('request'); // "Request" library
require('dotenv').config();

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

const createOrGetUser = async (access_token, refresh_token, callback) => {
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { Authorization: 'Bearer ' + access_token },
    json: true,
  };

  // use the access token to access the Spotify Web API
  request.get(options, async (error, response, userProfile) => {
    var user = await User.findOne({ where: { s_id: userProfile.id } });
    if (!user) {
      user = await User.create({
        s_refresh_token: refresh_token,
        s_access_token: access_token,
        name: userProfile.display_name,
        s_id: userProfile.id,
      });
    }
    
    callback(user);
  });
};

const refreshUserToken = async (user, callback) => {
  var refresh_token = user.s_refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, async (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      await user.update({ s_access_token: access_token });
      callback(user, access_token);
    }
  });
};

export { refreshUserToken, createOrGetUser };
