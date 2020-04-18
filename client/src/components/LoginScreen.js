import React from 'react';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

// const LOGIN_URI = process.env.NODE_ENV !== 'production'
//     ? 'http://localhost:8888/login'
//     : 'https://yourgoodtaste.herokuapp.com/login';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: theme.spacing(10),
  },
  btn: {
    color: theme.palette.success.main,
    borderColor: theme.palette.success.main,
    borderRadius: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      color: 'white',
    },
  },
}));

const LoginScreen = () => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Box className={classes.root}>
        <Typography variant='h2'>
          <strong>Spotify Stats</strong>
        </Typography>
        <Button variant='outlined' href={process.env.REACT_APP_LOGIN_URI} className={classes.btn}>
          Login
        </Button>
      </Box>
    </>
  );
};

export default LoginScreen;
