import PropTypes from 'prop-types';

const appPropTypes = {
  config: PropTypes.shape({
    clientAppSettings: PropTypes.shape({
      apiUrl: PropTypes.string,
      identityUrl: PropTypes.string,
      thisUrl: PropTypes.string,
      djangoUrl: PropTypes.string,
      apiScheme: PropTypes.string,
      trackMetrics: PropTypes.bool,
    }),
  }),
  cameraFilters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
};

export default appPropTypes;
