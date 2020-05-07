import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Loader from './Loader';
import PlotAverageFeatures from './PlotAverageFeatures';
import PlotFeatureScatter from './PlotFeaturesScatter';
import { getPlaylistDetails } from '../spotify';

import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: 'auto',
    marginBottom: theme.spacing(3),
    height: theme.spacing(24),
    padding: theme.spacing(2),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    minWidth: theme.spacing(20),
    borderRadius: 4,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const PlaylistProfile = (props) => {
  const classes = useStyles();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    getPlaylistDetails(props.id).then((playlist) => setPlaylist(playlist));
  }, [props.id]);

  if (playlist === null) return <Loader />;

  return (
    <>
      <Grid container direction='row' justify='flex-start'>
        <Grid item lg={6} sm={6} xs={12}>
          <Card className={classes.root}>
            <CardMedia
              className={classes.cover}
              image={playlist.images[0].url}
              title={playlist.name}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Link
                  color='inherit'
                  href={playlist.external_urls.spotify}
                  target='_blank'
                  variant='h5'
                >
                  <strong>{playlist.name}</strong>
                </Link>
                <Typography variant='subtitle1' color='textSecondary'>
                  {playlist.description}
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        <Grid item lg={6} sm={6} xs={12}>
          <PlotAverageFeatures audio_features={playlist.audio_features} />
        </Grid>
      </Grid>
      <PlotFeatureScatter playlist={playlist} />
    </>
  );
};

PlaylistProfile.propTypes = {
  id: PropTypes.string,
};

export default PlaylistProfile;
