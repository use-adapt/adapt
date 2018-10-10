import React from 'react';
import ReactDOM from 'react-dom';
import Adapt from './adapt.js';

import data from './data.json';

ReactDOM.render(
  <Adapt data={data} />,
  document.getElementById('root')
);
