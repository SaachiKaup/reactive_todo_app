/* new code with just table */
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals.js'
import {App} from './App.js'
/*
const data = [
  {
    key: '1',
    task: 'Wake Up',
    timestamp: 32,
    description: 'Limit is 1000',
  },
  {
    key: '2',
    task: 'Eat Food',
    timestamp: 42,
    description: 'Testing Words',
  },
  {
    key: '3',
    task: 'Drink Water',
    timestamp: 32,
    description: 'Rock Crouch',
  },
  {
    key: '4',
    task: 'Sleep',
    timestamp: 32,
    description: 'Real Mansion',
  },
];
*/
ReactDOM.render(
  <div>
<App/>
</div>
, document.getElementById('root')
)

/**/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


reportWebVitals();


/*
Clear out after figuring out strict mode
import React from 'react';
import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Table, Input, Button, Popconfirm, Form } from 'antd'
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
main code above
*/