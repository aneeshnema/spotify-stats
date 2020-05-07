import React from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 240,
    padding: 16,
    margin: 'auto',
    marginTop: 8,
    marginBottom: 8,
    height: 320,
  },
  img: {
    height: 208,
    width: 208,
  },
  actionArea: {
    height: 288,
  },
});

const PlaylistItem = ({ playlist }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardActionArea href={`/playlist/${playlist.id}`}>
        <CardMedia
          component='img'
          alt={playlist.name}
          image={playlist.images.length > 0 ? playlist.images[0].url : ''}
          title={playlist.name}
          className={classes.img}
        />
        <CardContent>
          <Typography gutterBottom component='p'>
            <strong>{playlist.name}</strong>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

PlaylistItem.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default PlaylistItem;
