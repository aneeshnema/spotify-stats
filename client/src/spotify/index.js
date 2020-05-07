import axios from 'axios';

const EXPIRATION_TIME = 3600000;

// FUNCTION TO RETRIEVE OBJECT STORED IN STORAGE

const getObject = (key) => {
  const value = window.sessionStorage.getItem(key);
  if (value === null || value === 'undefined') return null;
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
        limit: 30,
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
        limit: 30,
        time_range: term,
      },
    });
    setObject('top_artists_' + term, data);
    return data;
  }
  return top_artists;
};

export const getPlaylists = async () => {
  var playlists = getObject('playlists');
  if (playlists === null) {
    playlists = {};
    var { data } = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers,
      params: {
        limit: 50,
      },
    });
    for (let p of data.items) playlists[p.id] = p;
    while (data.next !== null) {
      data = await axios
        .get(data.next, {
          headers,
          params: {
            limit: 50,
          },
        })
        .then((res) => res.data);
      for (let p of data.items) playlists[p.id] = p;
    }
    setObject('playlists', playlists);
  }
  return playlists;
};

export const getAudioFeatures = async (...ids) =>
  axios
    .get('https://api.spotify.com/v1/audio-features', {
      headers,
      params: {
        ids: ids.join(','),
      },
    })
    .then((res) => res.data.audio_features);

export const getPlaylistDetails = async (id) => {
  var playlist = getObject(id);
  if (playlist !== null) return playlist;
  const playlists = await getPlaylists();
  if (playlists[id] === undefined) {
    console.log(`No mathching playlist with id ${id} found`);
    return undefined;
  }
  playlist = playlists[id];
  playlist.items = [];
  playlist.audio_features = [];
  var data = { next: `https://api.spotify.com/v1/playlists/${id}/tracks` };
  while (data.next !== null) {
    data = await axios
      .get(data.next, {
        headers,
        params: {
          fields:
            'items(track(album(id,images,name,release_date),artists(genres,id,name),id,external_url,name,popularity,preview_url)),next',
        },
      })
      .then((res) => res.data);
    playlist.items.push(...data.items.map((ob) => ob.track));
    let audio_features = await getAudioFeatures(data.items.map((ob) => ob.track.id).join(','));
    playlist.audio_features.push(...audio_features);
  }
  setObject(id, playlist);
  return playlist;
};
