import React from 'react';
import { Router } from '@reach/router';
import LoginScreen from './LoginScreen';
import Boilerplate from './Boilerplate';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';

import { token } from '../spotify';
import { theme } from '../style/theme';

import 'typeface-montserrat';
import { ThemeProvider } from '@material-ui/core/styles';

const Home = () => {
  return (
    <Boilerplate>
      <Router>
        <TopTracks path='/' />
        <TopTracks path='/tracks' />
        <TopArtists path='/artists' />
      </Router>
    </Boilerplate>
  );
};

class App extends React.Component {
  render() {
    return <ThemeProvider theme={theme}>{token ? <Home /> : <LoginScreen />}</ThemeProvider>;
  }
}

export default App;
