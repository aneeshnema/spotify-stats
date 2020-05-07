import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import Loader from './Loader';
import PlaylistItem from './PlaylistItem';

import { getPlaylists } from '../spotify';

const Playlist = () => {
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    getPlaylists().then((playlists) => setPlaylists(playlists));
  }, []);

  function getGridItems() {
    return Object.keys(playlists).map((id, key) => (
      <Grid item key={key} xs={12} sm={6} md={4} lg={3} xl={2} spaceing={3}>
        <PlaylistItem playlist={playlists[id]} />
      </Grid>
    ));
  }

  return (
    <div>
      {playlists ? (
        <Grid container spacing={1} justify='space-evenly'>
          {getGridItems()}
        </Grid>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Playlist;
