import axios from 'axios';

// const REFRESH_URI = process.env.NODE_ENV !== 'production'
//     ? 'http://localhost:8888/refresh_token'
//     : '/refresh_token';

const EXPIRATION_TIME = 3600000;

// FUNCTION TO RETRIEVE OBJECT STORED IN STORAGE

const getObject = (key) => {
  const value = window.sessionStorage.getItem(key);
  if (value === null) return value;
  return JSON.parse(value);
};

// FUNCTION TO STORE OBJECT AS STRING IN STORAGE

const setObject = (key, value) => window.sessionStorage.setItem(key, JSON.stringify(value));

const getUrlVars = () => {
  var vars = {};
  for (let prop of window.location.hash.substring(1).split('&')) {
    let [key, val] = prop.split('=');
    vars[key] = val;
  }
  return vars;
};

//REFRESH ACCESS TOKEN EVERY 1 HOUR
// REFRESH_URI
const refreshAccessToken = async () => {
  const local_refresh_token = window.localStorage.getItem('refresh_token');
  axios
    .get('/refresh_token', {
      params: {
        refresh_token: local_refresh_token,
      },
    })
    .then((res) => {
      const access_token = res.data.access_token;
      console.log('New acccess_token', access_token);
      window.localStorage.setItem('access_token', access_token);
      window.localStorage.setItem('token_timestamp', Date.now());
      window.location.reload();
    })
    .catch((e) => console.log(e));
};

// GET TOKEN, REFRESH IF REQUIRED

export const getAccessToken = () => {
  const { error, access_token, refresh_token } = getUrlVars();

  if (error) {
    console.log(error);
    refreshAccessToken();
  }

  if (access_token && refresh_token) {
    window.localStorage.setItem('access_token', access_token);
    window.localStorage.setItem('refresh_token', refresh_token);
    window.localStorage.setItem('token_timestamp', Date.now());
    return access_token;
  }

  const local_token_timestamp = window.localStorage.getItem('token_timestamp');

  if (
    local_token_timestamp &&
    local_token_timestamp !== 'undefined' &&
    Date.now() - local_token_timestamp > EXPIRATION_TIME
  ) {
    console.log('Access token expired, refreshing token...');
    refreshAccessToken();
  }

  const local_access_token = window.localStorage.getItem('access_token');

  return local_access_token;
};

// LOGOUT AND CLEAR CACHED API CALLS

export const logout = () => {
  console.log('logging out');
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.location.replace('/');
};

export const token = getAccessToken();

// CONST HEADER REQUIRED FOR EVERY API CALL

const headers = {
  Authorization: `Bearer ${token}`,
};

// SPOTIFY API CALLS

export const getMe = async () => {
  const me = getObject('get_me');
  if (me === null) {
    const { data } = await axios.get('https://api.spotify.com/v1/me', { headers });
    setObject('get_me', data);
    return data;
  }
  return me;
};

export const getTopTracks = async (term) => {
  const top_tracks = getObject('top_tracks_' + term);
  if (top_tracks === null) {
    const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
      headers,
      params: {
        limit: '30',
        time_range: term,
      },
    });
    setObject('top_tracks_' + term, data);
    return data;
  }
  return top_tracks;
};

export const getTopArtists = async (term) => {
  const top_artists = getObject('top_artists_' + term);
  if (top_artists === null) {
    const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers,
      params: {
        limit: '30',
        time_range: term,
      },
    });
    setObject('top_artists_' + term, data);
    return data;
  }
  return top_artists;
};
