// src/services/spotifyService.js
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();
const CLIENT_ID = 'd7a3d047c4134ca592c353efa25ea067';
const REDIRECT_URI = 'http://localhost:3000/';
const SCOPES = ['user-read-playback-state', 'user-read-currently-playing', 'playlist-read-private'];

export const getSpotifyAuthURL = () => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join('%20')}&response_type=token&show_dialog=true`;
};

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      const parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export default spotify;
