import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cmsImage from 'assets/connect.png';
import promoImage from 'assets/connect-plus-promo.png';
import issImage from 'assets/connect-plus-iss.png';
import CmsList from 'components/SchoolSolutions/Cms/cmslist';
import ISSList from 'components/SchoolSolutions/ISS/isslist';
import PromotionsList from 'components/SchoolSolutions/Promotions/promotionslist';
import noSelectionImage from 'assets/connect-no-selection.png';
import loadingImage from 'assets/Facebook-1s-200px.gif';
import SchoolQuoteForm from './SchoolQuoteForm';
import messages from './messages';

function getHeaderImage(selPackage) {
  let retImage;
  switch (selPackage) {
    case '1':
      retImage = cmsImage;
      break;
    case '2':
      retImage = promoImage;
      break;
    case '3':
      retImage = issImage;
      break;
    default:
      retImage = noSelectionImage;
      break;
  }
  return retImage;
}

function getHeaderImageAlt(selPackage) {
  let retAlt;
  switch (selPackage) {
    case '1':
      retAlt = 'TBD';
      break;
    case '2':
      retAlt = 'TODO';
      break;
    case '3':
      retAlt = 'TODO';
      break;
    default:
      retAlt = 'TBD';
      break;
  }
  return retAlt;
}

function getPackageDetails(selPackage) {
  let retDetails;
  switch (selPackage) {
    case '1':
      retDetails = <CmsList />;
      break;
    case '2':
      retDetails = <PromotionsList />;
      break;
    case '3':
      retDetails = <ISSList />;
      break;
    default:
      retDetails = '';
      break;
  }
  return retDetails;
}

function SchoolQuote(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="eight columns">
          <p className="quote-heading">
            <FormattedMessage {...messages.header} />
          </p>
          <hr />
          <SchoolQuoteForm
            schoolPackage={props.schoolpackage}
            countrylist={props.countrylist}
            onUpdateCountry={(item) => props.onUpdateSchoolPackageCountry(item)}
            onUpdateStudents={(item) => props.onUpdateSchoolPackageStudents(item)}
            onUpdateJobs={(item) => props.onUpdateSchoolPackageJobs(item)}
            onUpdateTuition={(item) => props.onUpdateSchoolPackageTuition(item)}
            onUpdateIbdp={(item) => props.onUpdateSchoolPackageIbdp(item)}
            onRequestQuote={() => props.onRequestSchoolQuote()}
          />
        </div>
        <div className="four columns">
          <div className="quote-box">
            <div className="quote-header">
              <p className="quote-selection">
                <FormattedMessage {...messages.selection} />
              </p>
              <img
                src={getHeaderImage(props.schoolpackage.SubscriptionId)}
                alt={getHeaderImageAlt(props.schoolpackage.SubscriptionId)}
                title={getHeaderImageAlt(props.schoolpackage.SubscriptionId)}
              />
            </div>
            <div className="quote-value">
              <div className="quote-value-text"><FormattedMessage {...messages.totalText} /></div>
              <div className="quote-loading">
                {props.schoolpackage.loadingQuote ? <img src={loadingImage} alt="loading" /> : <div>bye</div>}
              </div>
            </div>
            <div className="quote-details">
              <p className="quote-details-heading"><FormattedMessage {...messages.includesText} /></p>
              {getPackageDetails(props.schoolpackage.SubscriptionId)}
              <p className="quote-subscription">
                <FormattedMessage {...messages.subscriptionText} />
              </p>
              <button className="quote-button">
                <FormattedMessage {...messages.signupText} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SchoolQuote.propTypes = {
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
  countrylist: PropTypes.array,
  onUpdateSchoolPackageCountry: PropTypes.func,
  onUpdateSchoolPackageStudents: PropTypes.func,
  onUpdateSchoolPackageJobs: PropTypes.func,
  onUpdateSchoolPackageTuition: PropTypes.func,
  onUpdateSchoolPackageIbdp: PropTypes.func,
  onRequestSchoolQuote: PropTypes.func,
};

export default SchoolQuote;
