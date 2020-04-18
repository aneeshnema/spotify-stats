import React, { useState, useEffect } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Loader from './Loader';
import Artist from './Artist';

import { getTopArtists } from '../spotify';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: theme.spacing(3),
  },
}));

const TopArtists = () => {
  const classes = useStyles();
  const [artists, setArtists] = useState(null);
  const [value, setValue] = useState('short_term');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTopArtists(value).then((artists) => setArtists(artists));
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
          <Tab label='1 year' value='long_term' />
        </Tabs>
      </Paper>
      {artists ? (
        artists.items.map((artist, key) => <Artist key={key} artist={artist} />)
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TopArtists;
