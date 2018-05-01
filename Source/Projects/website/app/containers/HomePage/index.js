/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
// import NewWindow from 'react-new-window';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import injectSaga from 'utils/injectSaga';
import { countriesStart } from 'containers/App/actions';
import { makeSelectCountries } from 'containers/App/selectors';
import saga from 'containers/App/saga';
import mgr from 'containers/AuthConnect/userManager';
import messages from './messages';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    if (!this.props.countries) {
      this.props.onGetCountries();
    }
  }

  performAuth() {
    const args = {};
    args.redirect_uri = 'http://10.1.1.110:3000/popupcallback';
    args.extraQueryParams = {};
    args.extraQueryParams.currenttheme = 'simplex';
    mgr.signinPopup(args);
    mgr.events.addUserLoaded((loadedUser) => {
      if (loadedUser) {
        console.log(loadedUser);
      } else {
        console.log('login failed'); // replace with intl message
      }
    });
  }

  render() {
    return (
      <main>
        <Helmet>
          <title>Home Page</title>
          <meta name="ISS Schrole Connect" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
        </Helmet>

        <div className="connect-banner">
          <div className="container" >
            <div className="row">
              <div className="twelve columns">
                <div className="banner-heading"><FormattedMessage {...messages.header} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="second-row">
          <div className="container" >
            <div className="row">
              <div className="four columns">
                <ul>
                  <li><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
              <div className="four columns">
                <ul>
                  <li><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
              <div className="four columns">
                <ul>
                  <li onClick={() => { this.performAuth(); }}><FormattedMessage {...messages.listitem} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </main>
    );
  }
}

HomePage.propTypes = {
  countries: PropTypes.array,
  onGetCountries: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onGetCountries: () => dispatch(countriesStart()),
  };
}

const mapStateToProps = createStructuredSelector({
  countries: makeSelectCountries(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withSaga,
  withConnect,
)(HomePage);
