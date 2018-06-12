/**
 *
 * ExampleContainer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectExampleContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class ExampleContainer extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

ExampleContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  examplecontainer: makeSelectExampleContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'exampleContainer', reducer });
const withSaga = injectSaga({ key: 'exampleContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ExampleContainer);
