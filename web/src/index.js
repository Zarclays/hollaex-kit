import 'babel-polyfill';
import React from 'react';
import { hash } from 'rsvp';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import merge from 'lodash.merge';
// import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import config, { ProjectConfig } from 'config/project.config';
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
  setValidLanguages,
} from 'utils/initialize';

import { getConfig, getValidLanguages } from 'actions/operatorActions';

import { version, name } from '../package.json';
import { API_URL } from './config/constants';
console.log(name, version);
console.log(API_URL);

const generateRequest = async (key) => {
	return await getConfig(key);
}

const getConfigs = async () => {
  const localVersions = getLocalVersions();
  const remoteVersions = await getRemoteVersion();
  const validLanguages = await getValidLanguages();

  const promises = {};
  Object.entries(remoteVersions).forEach(([key]) => {
    const localVersion = localVersions[key];
    const remoteVersion = remoteVersions[key];

    if (localVersion !== remoteVersion) {
      promises[key] = generateRequest(key)
    }
  })

  const remoteConfigs = await hash(promises);
  Object.keys(remoteConfigs).forEach(([key]) => {
    localStorage.setItem(key, JSON.stringify(remoteConfigs[key]));
  })

  const localConfigs = {};
  Object.keys(remoteVersions).forEach((key) => {
    localConfigs[key] = JSON.parse(localStorage.getItem(key) || "{}");
  })

  setLocalVersions(remoteVersions);
  setValidLanguages(validLanguages);

  const mergedConfigs = merge(config, localConfigs);

  return mergedConfigs;
}

const bootstrapApp = (appConfig) => {
  initializeStrings()
  window.appConfig = { ...appConfig }

  render(
		<Provider store={store}>
      <ProjectConfig.Provider value={appConfig}>
			  <Router routes={routes} history={browserHistory} />
      </ProjectConfig.Provider>
		</Provider>,
    document.getElementById('root')
  );
}

getConfigs()
	.then(bootstrapApp)
	.catch((err) => console.error(err))

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
