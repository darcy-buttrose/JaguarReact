import PropTypes from 'prop-types';

const routePropTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default routePropTypes;
