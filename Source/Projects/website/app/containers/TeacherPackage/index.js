/**
 *
 * TeacherPackage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Switch, NavLink } from 'react-router-dom';
import TeacherSolutions from 'components/TeacherSolutions';
import PropsRoute from 'containers/PropsRoute';
import TeacherQuote from 'components/TeacherQuote';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  selectTeacherPackage,
  updateTeacherPackageFirstName,
  updateTeacherPackageLastName,
  updateTeacherPackageEmail,
  updateTeacherPackageTerms,
} from './actions';
import makeSelectTeacherPackage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class TeacherPackage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  selectPackage(item) {
    this.props.onSelectPackage(item);
    this.props.onMoveNext();
  }

  render() {
    return (
      <main>
        <Helmet>
          <title>{messages.title.defaultMessage}</title>
          <meta name="ISS Schrole Connect" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
        </Helmet>

        <div className="connect-banner">
          <div className="container" >
            <div className="row">
              <div className="twelve columns">
                <div className="banner-heading">
                  <FormattedMessage {...messages.header} />
                </div>
                <nav>
                  <ul className="solution-steps">
                    <li className="solution-step"><NavLink exact to="/teacherpackage">1</NavLink></li>
                    <li className="solution-step"><NavLink to="/teacherpackage/teacherquote">2</NavLink></li>
                    <li className="solution-step"><NavLink to="/schools">3</NavLink></li>
                    <li className="solution-step"><NavLink to="/schools">4</NavLink></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="second-row">
          <div className="container" >
            <div className="row">
              <div className="twelve columns">
                <div className="mid-page-content">
                  <Switch>
                    <PropsRoute
                      exact
                      path="/teacherpackage"
                      component={TeacherSolutions}
                      onSelect={(item) => { this.selectPackage(item); }}
                    />
                    <PropsRoute
                      exact
                      path="/teacherpackage/teacherquote"
                      component={TeacherQuote}
                      teacherpackage={this.props.teacherpackage}
                      onUpdateFirstName={(item) => { this.props.onUpdateFirstName(item); }}
                      onUpdateLastName={(item) => { this.props.onUpdateLastName(item); }}
                      onUpdateEmail={(item) => { this.props.onUpdateEmail(item); }}
                      onUpdateTerms={(item) => { this.props.onUpdateTerms(item); }}
                    />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    );
  }
}

TeacherPackage.propTypes = {
  teacherpackage: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    emailAddress: PropTypes.string,
    password: PropTypes.string,
    passwordConfirm: PropTypes.string,
    terms: PropTypes.bool,
    errorMessage: PropTypes.string,
    quotePrice: PropTypes.string,
    loadingQuote: PropTypes.bool,
  }),
  onSelectPackage: PropTypes.func,
  onUpdateFirstName: PropTypes.func,
  onUpdateLastName: PropTypes.func,
  onUpdateEmail: PropTypes.func,
  onUpdateTerms: PropTypes.func,
  onMoveNext: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  teacherpackage: makeSelectTeacherPackage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSelectPackage: (item) => dispatch(selectTeacherPackage(item)),
    onUpdateFirstName: (item) => dispatch(updateTeacherPackageFirstName(item)),
    onUpdateLastName: (item) => dispatch(updateTeacherPackageLastName(item)),
    onUpdateEmail: (item) => dispatch(updateTeacherPackageEmail(item)),
    onUpdateTerms: (item) => dispatch(updateTeacherPackageTerms(item)),
    onMoveNext: () => dispatch(push('/teacherpackage/teacherquote')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'teacherPackage', reducer });
const withSaga = injectSaga({ key: 'teacherPackage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(TeacherPackage);
