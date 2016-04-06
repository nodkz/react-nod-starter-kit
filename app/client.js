import 'babel-polyfill';
import { Router, browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import FastClick from 'fastclick';
import { addEventListener, removeEventListener } from '../lib/core/DOMUtils';
import routes from './routes';
import AppContext from 'app/_components/App/AppContext';

let cssContainer = document.getElementById('css');
const appContainer = document.getElementById('app');

const context = {
  insertCss: styles => styles._insertCss(),
};

window.context = context;

function render() {
  ReactDOM.render(
    <AppContext {...context}>
      <Router routes={routes} history={browserHistory} />
    </AppContext>,
    appContainer,
    () => {
      // Remove the pre-rendered CSS because it's no longer used
      // after the React app is launched
      if (cssContainer) {
        cssContainer.parentNode.removeChild(cssContainer);
        cssContainer = null;
      }
    }
  );
}

function run() {
  // Make taps on links and buttons work fast on mobiles
  FastClick.attach(document.body);

  if (!global.Intl) {
    require.ensure([
      'intl',
      'intl/locale-data/jsonp/en.js',
    ], function (require) {
      require('intl');
      require('intl/locale-data/jsonp/en.js');
      render();
    });
  } else {
    render();
  }
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
