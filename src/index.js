/* global window, document, VERSION */
import React from 'react';
import {render} from 'react-dom';
import {hashHistory} from 'react-router';

import '../css/sass/main.scss';

import Root from './app/Root';
import createStore from './app/store';
import {fetchConfig} from './config/ConfigActions';
import {updateLocation} from './location/LocationActions';

import Perf from 'react-addons-perf';
window.Perf = Perf;


const store = createStore(window.devToolsExtension && window.devToolsExtension());
store.unsubscribeHistory = hashHistory.listen(updateLocation(store));

console.log(`Gohan version: ${VERSION.gohanWebUI.version}, repo tag: ${VERSION.gohanWebUI.tag}`);

store.dispatch(fetchConfig()).then(() => {

  render(
    (
      <Root store={store} history={hashHistory} />
    ),
    document.getElementById('root')
  );
});
