/**
 *
 * App
 *
 * This component is the skeleton around the actual pages
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import AppRoute from 'containers/AppRoute';
import PublicLayout from 'layouts/PublicLayout';
import HomePage from 'containers/HomePage/Loadable';
import FeaturePage from 'containers/FeaturePage/Loadable';
import CallbackPage from 'containers/CallbackPage';
import PopupCallback from 'containers/PopupCallback';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NotAuthorisedPage from 'containers/NotAuthorisedPage/Loadable';
import '../../style/index.scss';

export default function App() {
  return (
    <div>
      <Helmet
        titleTemplate="%s - Jaguar"
        defaultTitle="Jaguar"
      >
        <meta name="Jaguar" content="." />
      </Helmet>
      <Switch>
        <AppRoute exact path="/" layout={PublicLayout} component={HomePage} />
        <AppRoute path="/features" layout={PublicLayout} component={FeaturePage} />
        <AppRoute path="/noauth" layout={PublicLayout} component={NotAuthorisedPage} />
        <Route path="/callback" component={CallbackPage} />
        <Route path="/popupcallback" component={PopupCallback} />
        <AppRoute path="" layout={PublicLayout} component={NotFoundPage} />
      </Switch>
    </div>
  );
}
