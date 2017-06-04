import React from 'react';
import ReactDOM from 'react-dom';
import Adapt from './adapt.js';

import * as sampleData from './data.json';

console.log(sampleData);

ReactDOM.render(
  <Adapt data={sampleData} />,
  document.getElementById('root')
);
