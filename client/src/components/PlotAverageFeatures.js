import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

import { Container } from '@material-ui/core';

const keys = [
  'danceability',
  'energy',
  'speechiness',
  'acousticness',
  'instrumentalness',
  'liveness',
  'valence',
  // 'key',
  // 'loudness',
  // 'mode',
  // 'tempo',
  // 'duration_ms',
];

const PlotAverageFeatures = ({ audio_features }) => {
  useEffect(() => {
    var n = audio_features.length;
    var avg = {};
    for (let k of keys) avg[k] = 0;
    for (let features of audio_features) for (let k of keys) avg[k] += features[k];
    for (let k of keys) avg[k] /= n;

    var ctx = document.getElementById('avg');
    new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: Object.keys(avg),
        datasets: [
          {
            label: 'Average Value',
            data: Object.values(avg),
            backgroundColor: 'rgba(29, 185, 84, 0.5)',
            hoverBackgroundColor: 'rgba(29, 185, 84, 1)',
            borderColor: 'rgba(29, 185, 84, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMax: 1.0,
              },
              gridLines: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
            },
          ],
        },
      },
    });
  }, []);

  return (
    <Container
      id='avg-container'
      style={{ position: 'relative', height: 'auto', width: 'auto', paddingRight: 0 }}
    >
      <canvas id='avg' style={{ maxHeight: '192px', maxWidth: '400px' }}></canvas>
    </Container>
  );
};

PlotAverageFeatures.propTypes = {
  audio_features: PropTypes.array.isRequired,
};

export default PlotAverageFeatures;
