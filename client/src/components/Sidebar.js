import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Loader from './Loader';

import { getMe, logout } from '../spotify';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  large: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginRight: theme.spacing(2),
  },
  root: {
    backgroundColor: '#040404',
    height: '100%',
  },
  btn: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    borderRadius: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    textAlign: 'center',
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      color: 'white',
    },
  },
}));

const Sidebar = () => {
  const classes = useStyles();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then((user) => setUser(user));
  }, []);

  const getUser = () => (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt='Remy Sharp' src={user.images[0].url} className={classes.large} />
      </ListItemAvatar>
      <ListItemText>
        <strong>{user.display_name}</strong>
      </ListItemText>
    </ListItem>
  );

  return (
    <div className={classes.root}>
      {/* <div className={classes.toolbar} /> */}
      {user ? getUser() : <Loader />}
      <List>
        <ListItem key='tracks' component={Link} to='/tracks'>
          <Button variant='outlined' className={classes.btn}>
            Top Tracks
          </Button>
        </ListItem>
        <ListItem key='artists' component={Link} to='/artists'>
          <Button variant='outlined' className={classes.btn}>
            Top Artists
          </Button>
        </ListItem>
        <ListItem key='logout' onClick={logout}>
          <Button variant='outlined' className={classes.btn}>
            Logout
          </Button>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
