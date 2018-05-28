import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { setFilter, clearFilter } from '../LiveWallPage/actions';
import makeSelectRoute from '../../state/Route/selectors';
import makeSelectAuth from '../../state/Auth/selectors';
import authPropTypes from '../../state/Auth/propTypes';
import CameraFilter from '../../components/CameraFilter/index';


class DjangoButtons extends React.PureComponent {
  render() {
    if (this.props.auth && this.props.auth.user && this.props.auth.user.id_token && this.props.auth.user.id_token.length > 0) {
      return (
        <span>
          <button className="default-button" onClick={this.props.onGoLiveWall}>Livewall</button>
          {/* <CameraFilter></CameraFilter> */}
          {/* <button onClick={this.props.onGoLogout}>Logout</button> */}
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
  onSetLiveWallFilter: PropTypes.func,
  onClearLiveWallFilter: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
  route: makeSelectRoute()
});

function mapDispatchToProps(dispatch) {
  return {
    onGoLiveWall: () => dispatch(push('/livewall')),
    onGoLogout: () => dispatch(push('/logout')),
    onSetLiveWallFilter: (filter) => dispatch(setFilter(filter)),
    onClearLiveWallFilter: () => dispatch(clearFilter()),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoButtons);
