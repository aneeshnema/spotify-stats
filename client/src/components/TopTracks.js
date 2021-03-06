import React, { useState, useEffect } from 'react';

import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';

import Loader from './Loader';
import Track from './Track';

import { getTopTracks } from '../spotify';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(3),
  },
}));

const TopTracks = () => {
  const classes = useStyles();
  const [tracks, setTracks] = useState(null);
  const [value, setValue] = useState('short_term');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTopTracks(value).then((tracks) => setTracks(tracks));
  }, [value]);

  return (
    <div>
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor='primary'
          textColor='primary'
          centered
        >
          <Tab label='1 month' value='short_term' />
          <Tab label='6 months' value='medium_term' />
          <Tab label='All Time' value='long_term' />
        </Tabs>
      </Paper>
      {tracks ? tracks.items.map((track, key) => <Track key={key} track={track} />) : <Loader />}
    </div>
  );
};

export default TopTracks;
