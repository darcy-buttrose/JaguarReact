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
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <h1>
          <FormattedMessage {...messages.header} />
        </h1>
        {/* <button onClick={this.props.onGoLiveWall}>LiveWall</button> */}
        {/* <button onClick={this.props.onGoLogout}>Logout</button> */}
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
