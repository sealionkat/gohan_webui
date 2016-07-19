/* global $ */
// Import bootstraps.

import 'bootstrap';
import 'bootstrap-dialog';

// Import css.
import './../../node_modules/bootswatch/cosmo/bootstrap.css';
import './../../node_modules/font-awesome/css/font-awesome.css';
import '../css/sass/main.scss';

// Import JS.
import 'jquery';
import './contrail-layout';
import {history} from 'backbone';
import AppView from './views/appView';
import SchemaView from './views/schemaView';
import Router from './routers/router';
import Config from './models/configModel';



const config = new Config({url: 'config.json'});

config.fetch().then(() => {
  const router = new Router();
  const rootView = new AppView({
    router: router,
    config,
    viewClass: {
      schema: {
        table: SchemaView
      }}
  });

  router.route('', 'toppage', () => {
    router.navigate('v1.0/tenant/networks')
  });

  $('body').append(rootView.render().el);
  history.start();
}, () => {
  $('body').append('Failed to load config.json');
});
