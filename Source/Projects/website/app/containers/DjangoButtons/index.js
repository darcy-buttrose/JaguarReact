import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { setFilter } from '../LiveWallPage/actions';
import makeSelectRoute from '../../state/Route/selectors';
import makeSelectAuth from '../../state/Auth/selectors';
import authPropTypes from '../../state/Auth/propTypes';
import liveWallPropTypes from '../../containers/LiveWallPage/propTypes';
import CameraFilter from '../../components/CameraFilter/index';
import makeSelectLiveWall from '../../containers/LiveWallPage/selectors';
import makeSelectApp from '../../state/App/selectors';
import appPropTypes from '../../state/App/propTypes';
import routePropTypes from '../../state/Route/propTypes';
import LiveWallFullScreen from '../../components/LiveWallFullScreen/index';


class DjangoButtons extends React.PureComponent {
  render() {
    let renderCameraFilter = null;
    if (this.props.route.location.pathname === '/livewall') {
      renderCameraFilter = (
        <span>
          <CameraFilter
            filter={this.props.liveWall.filter}
            filters={this.props.app.cameraFilters}
            onChangeFilter={this.props.onSetLiveWallFilter}
          />
          <LiveWallFullScreen />
        </span>
      );
    }

    if (this.props.auth && this.props.auth.user && this.props.auth.user.id_token && this.props.auth.user.id_token.length > 0) {
      return (
        <span>
          {renderCameraFilter}
        </span>
      );
    }
    return null;
  }
}

DjangoButtons.propTypes = {
  route: PropTypes.shape(routePropTypes),
  app: PropTypes.shape(appPropTypes),
  auth: PropTypes.shape(authPropTypes),
  liveWall: PropTypes.shape(liveWallPropTypes),
  onSetLiveWallFilter: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
  auth: makeSelectAuth(),
  liveWall: makeSelectLiveWall(),
  route: makeSelectRoute(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGoLiveWall: () => dispatch(push('/livewall')),
    onGoLogout: () => dispatch(push('/logout')),
    onSetLiveWallFilter: (filter) => dispatch(setFilter(filter)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(DjangoButtons);
