/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import FontFaceObserver from 'fontfaceobserver';
import createHistory from 'history/createBrowserHistory';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-webpack-loader-syntax */
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-57x57.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-60x60.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-72x72.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-76x76.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-114x114.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-120x120.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/apple-touch-icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/favicon-16x16.png';
import '!file-loader?name=[name].[ext]!./images/favicon-32x32.png';
import '!file-loader?name=[name].[ext]!./images/favicon-96x96.png';
import '!file-loader?name=[name].[ext]!./images/favicon-128.png';
import '!file-loader?name=[name].[ext]!./images/favicon-196x196.png';
import '!file-loader?name=[name].[ext]!./images/mstile-70x70.png';
import '!file-loader?name=[name].[ext]!./images/mstile-144x144.png';
import '!file-loader?name=[name].[ext]!./images/mstile-150x150.png';
import '!file-loader?name=[name].[ext]!./images/mstile-310x150.png';
import '!file-loader?name=[name].[ext]!./images/mstile-310x310.png';
// eslint-disable-line import/extensions
/* eslint-enable import/no-webpack-loader-syntax */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Observe loading of Lato (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const latoObserver = new FontFaceObserver('Lato', {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
latoObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
}, () => {
  document.body.classList.remove('fontLoaded');
});


// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = (messages) => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise((resolve) => {
    resolve(import('intl'));
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
      import('intl/locale-data/jsonp/de.js'),
    ]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}
