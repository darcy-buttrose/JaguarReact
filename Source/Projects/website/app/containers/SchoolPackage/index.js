/**
 *
 * SchoolPackage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import PropsRoute from 'containers/PropsRoute';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import SchoolSolutions from 'components/SchoolSolutions';
import SchoolQuote from 'components/SchoolQuote';
import SchoolAccount from 'components/SchoolAccount';
import { Switch, NavLink } from 'react-router-dom';
import { makeSelectCountries } from 'containers/App/selectors';
import { countriesStart } from 'containers/App/actions';
import { selectSchoolPackage,
          updateSchoolPackageCountry,
          updateSchoolPackageStudents,
          updateSchoolPackageJobs,
          updateSchoolPackageTuition,
          updateSchoolPackageIBDP,
          quoteStart } from './actions';
import makeSelectSchoolPackage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';


export class SchoolPackage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    // if (!this.props.countriesList) {
    this.props.onGetCountries();
    // alert('hi');
    // }
  }

  selectCmsPackage(item) {
    this.props.onSelectPackage(item);
    this.props.onMoveSecond();
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
                <p className="herowhite">
                  <FormattedMessage {...messages.subheader} />
                </p>
                <nav>
                  <ul className="solution-steps">
                    <li className="solution-step"><NavLink exact to="/schoolpackage">1</NavLink></li>
                    <li className="solution-step"><NavLink to="/schoolpackage/schoolquote">2</NavLink></li>
                    <li className="solution-step"><NavLink to="/schoolpackage/schoolaccount">3</NavLink></li>
                    <li className="solution-step"><NavLink to="/schoolpackage/schoolaccount/confirmation">4</NavLink></li>
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
                      path="/schoolpackage"
                      component={SchoolSolutions}
                      onSelect={(item) => { this.selectCmsPackage(item); }}
                    />
                    <PropsRoute
                      exact
                      path="/schoolpackage/schoolquote"
                      component={SchoolQuote}
                      schoolpackage={this.props.schoolpackage}
                      countrylist={this.props.countriesList}
                      onUpdateSchoolPackageCountry={(item) => { this.props.onUpdatePackageCountry(item); }}
                      onUpdateSchoolPackageStudents={(item) => { this.props.onUpdatePackageStudents(item); }}
                      onUpdateSchoolPackageJobs={(item) => { this.props.onUpdatePackageJobs(item); }}
                      onUpdateSchoolPackageTuition={(item) => { this.props.onUpdatePackageTuition(item); }}
                      onUpdateSchoolPackageIbdp={(item) => { this.props.onUpdatePackageIBDP(item); }}
                      onRequestSchoolQuote={() => { this.props.onQuoteStart(); }}
                    />
                    <PropsRoute path="/schoolpackage/schoolaccount" component={SchoolAccount} {...this.props} />
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

SchoolPackage.propTypes = {
  schoolpackage: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    AnnualTuitionFee: PropTypes.string,
    MonthlyJobListings: PropTypes.string,
    StudentPopulation: PropTypes.string,
    CountryId: PropTypes.string,
    HasAdvancedCurriculum: PropTypes.string,
    errorMessage: PropTypes.string,
    quotePrice: PropTypes.string,
    loadingQuote: PropTypes.bool,
  }),
  countriesList: PropTypes.array,
  onSelectPackage: PropTypes.func,
  onUpdatePackageCountry: PropTypes.func,
  onUpdatePackageStudents: PropTypes.func,
  onUpdatePackageTuition: PropTypes.func,
  onUpdatePackageJobs: PropTypes.func,
  onUpdatePackageIBDP: PropTypes.func,
  onMoveSecond: PropTypes.func,
  onQuoteStart: PropTypes.func,
  onGetCountries: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  schoolpackage: makeSelectSchoolPackage(),
  countriesList: makeSelectCountries(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSelectPackage: (item) => dispatch(selectSchoolPackage(item)),
    onUpdatePackageCountry: (item) => dispatch(updateSchoolPackageCountry(item)),
    onUpdatePackageStudents: (item) => dispatch(updateSchoolPackageStudents(item)),
    onUpdatePackageTuition: (item) => dispatch(updateSchoolPackageTuition(item)),
    onUpdatePackageJobs: (item) => dispatch(updateSchoolPackageJobs(item)),
    onUpdatePackageIBDP: (item) => dispatch(updateSchoolPackageIBDP(item)),
    onQuoteStart: () => dispatch(quoteStart()),
    onGetCountries: () => dispatch(countriesStart()),
    onMoveSecond: () => dispatch(push('/schoolpackage/schoolquote')),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'schoolPackage', reducer });
const withSaga = injectSaga({ key: 'schoolPackage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(SchoolPackage);
