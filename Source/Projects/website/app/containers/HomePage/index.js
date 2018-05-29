/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>Private Page</title>
                <meta name="Private Page" content="." />
              </Helmet>
              <div>
                <h1>This is the home page.</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  onGoLiveWall: PropTypes.func,
  onGoLogout: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onGoLiveWall: () => dispatch(push('/livewall')),
    onGoLogout: () => dispatch(push('/logout')),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
