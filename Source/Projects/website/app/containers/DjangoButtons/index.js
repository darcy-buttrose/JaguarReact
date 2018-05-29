import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import makeSelectAuth from '../../state/Auth/selectors';
import authPropTypes from '../../state/Auth/propTypes';

class DjangoButtons extends React.PureComponent {
  render() {
    if (this.props.auth && this.props.auth.user && this.props.auth.user.id_token && this.props.auth.user.id_token.length > 0) {
      return (
        <span>
        </span>
      );
    }
    return null;
  }
}

DjangoButtons.propTypes = {
  auth: PropTypes.shape(authPropTypes),
  onGoLiveWall: PropTypes.func,
  // onGoLogout: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGoLiveWall: () => dispatch(push('/livewall')),
    onGoLogout: () => dispatch(push('/logout')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoButtons);
