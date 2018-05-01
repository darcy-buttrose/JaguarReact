/*
 *
 * Navbar container
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import injectReducer from 'utils/injectReducer';
import Navbar from 'components/Navbar';
import makeSelectNavbar from './selectors';
import reducer from './reducer';
import { openMenu, closeMenu } from './actions';

export class NavbarControl extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  toggleMenu() {
    if (this.props.navbar.isOpen) {
      this.props.onCloseMenu();
    } else {
      this.props.onOpenMenu();
    }
  }

  closeMenu() {
    if (this.props.navbar.isOpen) {
      this.props.onCloseMenu();
    }
  }

  render() {
    return (
      <Navbar onToggleMenu={() => { this.toggleMenu(); }} onCloseMenu={() => { this.closeMenu(); }} isOpen={this.props.navbar.isOpen} />
    );
  }
}

NavbarControl.propTypes = {
  onOpenMenu: PropTypes.func,
  onCloseMenu: PropTypes.func,
  navbar: PropTypes.shape({
    isOpen: PropTypes.bool,
  }),
};

const mapStateToProps = createStructuredSelector({
  navbar: makeSelectNavbar(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onOpenMenu: () => dispatch(openMenu()),
    onCloseMenu: () => dispatch(closeMenu()),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'navbar', reducer });

export default compose(
  withReducer,
  withConnect,
)(NavbarControl);
