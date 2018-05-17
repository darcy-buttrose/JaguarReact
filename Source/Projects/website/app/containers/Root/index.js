import React from 'react';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

// Import root app
import App from '../App';
import { startLoadConfig } from '../App/actions';

class Root extends React.PureComponent {
  componentDidMount() {
    this.props.onStart();
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <App />
      </ConnectedRouter>
    );
  }
}

Root.propTypes = {
  history: PropTypes.any,
  onStart: PropTypes.func,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onStart: () => dispatch(startLoadConfig()),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
