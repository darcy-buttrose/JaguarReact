/**
 *
 * App
 *
 * This component is the skeleton around the actual pages
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import AppRoute from '../AppRoute/index';
import PublicLayout from '../../layouts/PublicLayout/index';
import MainLayout from '../../layouts/MainLayout/index';
import PrivatePage from '../PrivatePage/Loadable';
import CallbackPage from '../CallbackPage/index';
import PopupCallback from '../PopupCallback/index';
import NotFoundPage from '../NotFoundPage/Loadable';
import NotAuthorisedPage from '../NotAuthorisedPage/Loadable';
import LiveWallPage from '../LiveWallPage/Loadable';
import LoginPage from '../DjangoLoginPage/Loadable';
import LogoutPage from '../DjangoLogoutPage/Loadable';
import AdminPage from '../AdminPage/Loadable';
import HistoryPage from '../HistoryPage/Loadable';
import PlaybackWallPage from '../PlaybackWallPage/Loadable';
import PlaybackPage from '../PlaybackPage/Loadable';
import '../../style/index.scss';

function Router() {
  return (
    <div>
      <Helmet
        titleTemplate="%s - Jaguar"
        defaultTitle="Jaguar"
      >
        <meta name="Jaguar" content="." />
      </Helmet>
      <Switch>
        <AppRoute exact path="/" layout={PublicLayout} component={LoginPage} />
        <AppRoute exact path="/private" layout={MainLayout} component={PrivatePage} />
        <AppRoute exact path="/playbackwall" layout={MainLayout} component={PlaybackWallPage} />
        <AppRoute exact path="/playback" layout={MainLayout} component={PlaybackPage} />
        <AppRoute exact path="/history" layout={MainLayout} component={HistoryPage} />
        <AppRoute exact path="/admin" layout={MainLayout} component={AdminPage} />
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

export default Router;
