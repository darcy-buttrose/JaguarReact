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
import MainLayout from 'layouts/MainLayout';
import HomePage from 'containers/HomePage/Loadable';
import PrivatePage from 'containers/PrivatePage';
import CallbackPage from 'containers/CallbackPage';
import PopupCallback from 'containers/PopupCallback';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NotAuthorisedPage from 'containers/NotAuthorisedPage/Loadable';
import '../../style/index.scss';
import LiveWallPage from '../LiveWallPage/Loadable';
import LoginPage from '../DjangoLoginPage/Loadable';
import LogoutPage from '../DjangoLogoutPage/Loadable';

function App() {
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
        <AppRoute exact path="/private" layout={MainLayout} component={PrivatePage} />
        <AppRoute exact path="/livewall" layout={MainLayout} component={LiveWallPage} />
        <AppRoute exact path="/login" layout={PublicLayout} component={LoginPage} />
        <AppRoute exact path="/logout" layout={PublicLayout} component={LogoutPage} />
        <AppRoute path="/noauth" layout={PublicLayout} component={NotAuthorisedPage} />
        <Route path="/callback" component={CallbackPage} />
        <Route path="/popupcallback" component={PopupCallback} />
        <AppRoute path="" layout={PublicLayout} component={NotFoundPage} />
      </Switch>
    </div>
  );
}

export default App;
