import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Switch } from 'react-router-dom';
import PropsRoute from 'containers/PropsRoute';
import AccountConfirm from 'components/AccountConfirm';
import TeacherQuoteForm from 'components/TeacherQuote/TeacherQuoteForm';
import CmsFeatures from 'components/SchoolSolutions/Cms/cmslist';
import ISSFeatures from 'components/SchoolSolutions/ISS/isslist';
import PromotionsFeatures from 'components/SchoolSolutions/Promotions/promotionslist';
import noSelectionImage from 'assets/connect-no-selection.png';
import cmsImage from 'assets/connect.png';
import promotionsImage from 'assets/connect-plus-promo.png';
import issImage from 'assets/connect-plus-iss.png';
import messages from './messages';


function getHeaderImage(selPackage) {
  let retImage;
  switch (selPackage) {
    case '1':
      retImage = cmsImage;
      break;
    case '2':
      retImage = promotionsImage;
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
      retAlt = 'TODO';
      break;
    case '2':
      retAlt = 'TODO';
      break;
    case '3':
      retAlt = 'TODO';
      break;
    default:
      retAlt = 'TODO';
      break;
  }
  return retAlt;
}

function getPackageDetails(selPackage) {
  let retDetails;
  switch (selPackage) {
    case '1':
      retDetails = <CmsFeatures />;
      break;
    case '2':
      retDetails = <PromotionsFeatures />;
      break;
    case '3':
      retDetails = <ISSFeatures />;
      break;
    default:
      retDetails = '';
      break;
  }
  return retDetails;
}


function SchoolAccount(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="eight columns">
          <p className="quote-heading">
            <FormattedMessage {...messages.header} />
          </p>
          <hr />
          <Switch>
            <PropsRoute exact path="/schoolpackage/schoolaccount" component={TeacherQuoteForm} {...props} />
            <PropsRoute path="/schoolpackage/schoolaccount/confirmation" component={AccountConfirm} {...props} firstName="John" lastName="Morton" email="john@jdmorton.net" />
          </Switch>
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
              <p className="quote-value-text"><FormattedMessage {...messages.totalText} /></p>
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

SchoolAccount.propTypes = {
  schoolpackage: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
};

export default SchoolAccount;
