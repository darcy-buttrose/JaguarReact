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
import Teacher from 'containers/Teacher/Loadable';
import School from 'containers/School/Loadable';
import CallbackPage from 'containers/CallbackPage';
import PopupCallback from 'containers/PopupCallback';
import SchoolPackage from 'containers/SchoolPackage';
import TeacherPackage from 'containers/TeacherPackage';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import NotAuthorisedPage from 'containers/NotAuthorisedPage/Loadable';
import '../../style/index.scss';

export default function App() {
  return (
    <div>
      <Helmet
        titleTemplate="%s - ISS Schrole Connect"
        defaultTitle="ISS Schrole Connect"
      >
        <meta name="ISS Schrole Connect" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
      </Helmet>
      <Switch>
        <AppRoute exact path="/" layout={PublicLayout} component={HomePage} />
        <AppRoute path="/teachers" layout={PublicLayout} component={Teacher} />
        <AppRoute path="/schools" layout={PublicLayout} component={School} />
        <AppRoute path="/features" layout={PublicLayout} component={FeaturePage} />
        <AppRoute path="/schoolpackage" layout={PublicLayout} component={SchoolPackage} />
        <AppRoute path="/teacherpackage" layout={PublicLayout} component={TeacherPackage} />
        <AppRoute path="/noauth" layout={PublicLayout} component={NotAuthorisedPage} />
        <Route path="/callback" component={CallbackPage} />
        <Route path="/popupcallback" component={PopupCallback} />
        <AppRoute path="" layout={PublicLayout} component={NotFoundPage} />
      </Switch>
    </div>
  );
}
