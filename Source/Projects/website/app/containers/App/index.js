/**
 *
 * App
 *
 * This component is the skeleton around the actual pages
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import AppRoute from '../AppRoute';
import PublicLayout from '../../layouts/PublicLayout';
import MainLayout from '../../layouts/MainLayout';
import HomePage from '../HomePage/Loadable';
import PrivatePage from '../PrivatePage';
import CallbackPage from '../CallbackPage';
import PopupCallback from '../PopupCallback';
import NotFoundPage from '../NotFoundPage/Loadable';
import NotAuthorisedPage from '../NotAuthorisedPage/Loadable';
import '../../style/index.scss';
import LiveWallPage from '../LiveWallPage';
import LiveWallInnerPage from '../LiveWallInnerPage';

import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import makeSelectApp from './selectors';
import reducer from './reducer';
import { startLoadConfig } from './actions';
import saga from './saga';

class App extends React.PureComponent {
  componentDidMount() {
    this.props.loadConfig();
  }

  render() {
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
          <Route path="/livewall-inner" component={LiveWallInnerPage} />
          <AppRoute path="/noauth" layout={PublicLayout} component={NotAuthorisedPage} />
          <Route path="/callback" component={CallbackPage} />
          <Route path="/popupcallback" component={PopupCallback} />
          <AppRoute path="" layout={PublicLayout} component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  loadConfig: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadConfig: () => dispatch(startLoadConfig()),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'app', reducer });
const withSaga = injectSaga({ key: 'app', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(App);
