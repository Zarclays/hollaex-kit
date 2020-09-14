import 'babel-polyfill';
import React from 'react';
import { hash } from 'rsvp';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
// import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import './config/initialize';

import 'flag-icon-css/css/flag-icon.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-alice-carousel/lib/alice-carousel.css';

import store from './store';
import routes from './routes';
import './index.css';
import '../node_modules/rc-tooltip/assets/bootstrap_white.css'; // eslint-disable-line

import {
  setLocalVersions,
  getLocalVersions,
  getRemoteVersion,
  initializeStrings,
} from 'utils/initialize';

import { version, name } from '../package.json';
import { API_URL } from './config/constants';
console.log(name, version);
console.log(API_URL);

const generateRequest = async (key) => {
  const data = await new Promise((resolve, reject) => {
    setTimeout(() => resolve({ en: { ADD_TRADING_PAIR: 'test title' }}), 1000);
  });

	return data;
}

const getConfig = async () => {
  const localVersions = getLocalVersions();
  const remoteVersions = await getRemoteVersion();

  const promises = {};
  Object.entries(remoteVersions).forEach(([key]) => {
    const localVersion = localVersions[key];
    const remoteVersion = remoteVersions[key];

    if (localVersion !== remoteVersion) {
      promises[key] = generateRequest(key)
    }
  })

  const remoteConfigs = await hash(promises);
  Object.entries(remoteConfigs).forEach(([key]) => {
    localStorage.setItem(key, JSON.stringify(remoteConfigs[key]));
  })

  setLocalVersions(remoteVersions);
  return remoteConfigs;
}

const bootstrapApp = ({ strings }) => {
  initializeStrings(strings)

  render(
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} />
		</Provider>,
    document.getElementById('root')
  );
}

getConfig()
	.then(bootstrapApp)
	.catch((err) => console.error(err))

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
