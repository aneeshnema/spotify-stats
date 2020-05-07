import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

import {
  makeStyles,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';

const keys = [
  'danceability',
  'energy',
  'speechiness',
  'acousticness',
  'instrumentalness',
  'liveness',
  'valence',
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: theme.spacing(21),
    margin: theme.spacing(1),
  },
}));

const PlotFeaturesScatter = ({ playlist }) => {
  const classes = useStyles();
  const [axisKey, setAxisKey] = useState({ x: 'energy', y: 'danceability' });
  const chartRef = useRef(null);

  useEffect(() => {
    var ctx = document.getElementById('scatter');
    chartRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            pointBackgroundColor: 'rgba(29, 185, 84, 1)',
            data: playlist.audio_features.map((item) => ({
              x: item[axisKey.x],
              y: item[axisKey.y],
            })),
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: axisKey.x,
              },
              ticks: {
                suggestedMax: 1.0,
                suggestedMin: 0.0,
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: axisKey.y,
              },
              ticks: {
                suggestedMax: 1.0,
                suggestedMin: 0.0,
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem) =>
              `${playlist.items[tooltipItem.index].name} (${tooltipItem.label}, ${
                tooltipItem.value
              })`,
          },
        },
      },
    });
  }, []);

  useEffect(() => {
    chartRef.current.data.datasets[0].data = playlist.audio_features.map((item) => ({
      x: item[axisKey.x],
      y: item[axisKey.y],
    }));
    chartRef.current.options.scales.xAxes[0].scaleLabel.labelString = axisKey.x;
    chartRef.current.options.scales.yAxes[0].scaleLabel.labelString = axisKey.y;
    chartRef.current.update();
  }, [axisKey]);

  const handleChangeX = (event) => setAxisKey({ x: event.target.value, y: axisKey.y });
  const handleChangeY = (event) => setAxisKey({ x: axisKey.x, y: event.target.value });

  return (
    <Container>
      <Typography variant='h5'>
        <strong>Plot Features</strong>
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel>X-axis</InputLabel>
        <Select autoWidth value={axisKey.x} onChange={handleChangeX}>
          {keys.map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Y-axis</InputLabel>
        <Select value={axisKey.y} onChange={handleChangeY}>
          {keys.map((key) => (
            <MenuItem key={key} value={key}>
              {key}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Container
        id='scatter-container'
        style={{ position: 'relative', height: 'auto', width: 'auto' }}
      >
        <canvas id='scatter' style={{ minHeight: '192px' }}></canvas>
      </Container>
    </Container>
  );
};

PlotFeaturesScatter.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default PlotFeaturesScatter;
