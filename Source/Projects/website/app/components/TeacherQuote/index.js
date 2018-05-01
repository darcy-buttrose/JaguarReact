import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CandidateFeatures from 'components/TeacherSolutions/CandidatePackage/CandidateFeatures';
import ISSFeatures from 'components/TeacherSolutions/ISSPackage/ISSFeatures';
import MemberFeatures from 'components/TeacherSolutions/MemberPackage/MemberFeatures';
import noSelectionImage from 'assets/connect-no-selection.png';
import candidateImage from 'assets/connect-candidate.png';
import memberImage from 'assets/connect-member.png';
import issImage from 'assets/connect-preferred.png';
import messages from './messages';
import TeacherQuoteForm from './TeacherQuoteForm';

function getHeaderImage(selPackage) {
  let retImage;
  switch (selPackage) {
    case 'teacher_candidate':
      retImage = candidateImage;
      break;
    case 'teacher_member':
      retImage = memberImage;
      break;
    case 'teacher_iss':
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
    case 'teacher_candidate':
      retAlt = 'TBD';
      break;
    case 'teacher_member':
      retAlt = 'TODO';
      break;
    case 'teacher_iss':
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
    case 'teacher_candidate':
      retDetails = <CandidateFeatures />;
      break;
    case 'teacher_member':
      retDetails = <MemberFeatures />;
      break;
    case 'teacher_iss':
      retDetails = <ISSFeatures />;
      break;
    default:
      retDetails = '';
      break;
  }
  return retDetails;
}


function TeacherQuote(props) {
  return (
    <div className="container">
      <div className="row">
        <div className="eight columns">
          <p className="quote-heading">
            <FormattedMessage {...messages.header} />
          </p>
          <hr />
          <TeacherQuoteForm
            package={props.teacherpackage}
            onUpdateFirstName={(item) => props.onUpdateFirstName(item)}
            onUpdateLastName={(item) => props.onUpdateLastName(item)}
            onUpdateEmail={(item) => props.onUpdateEmail(item)}
            onUpdateTerms={(item) => props.onUpdateTerms(item)}
          />
        </div>
        <div className="four columns">
          <div className="quote-box">
            <div className="quote-header">
              <p className="quote-selection">
                <FormattedMessage {...messages.selection} />
              </p>
              <img
                src={getHeaderImage(props.teacherpackage.SubscriptionId)}
                alt={getHeaderImageAlt(props.teacherpackage.SubscriptionId)}
                title={getHeaderImageAlt(props.teacherpackage.SubscriptionId)}
              />
            </div>
            <div className="quote-value">
              <div className="quote-value-text"><FormattedMessage {...messages.totalText} /></div>
            </div>
            <div className="quote-details">
              <p className="quote-details-heading"><FormattedMessage {...messages.includesText} /></p>
              {getPackageDetails(props.teacherpackage.SubscriptionId)}
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

TeacherQuote.propTypes = {
  teacherpackage: PropTypes.shape({
    SubscriptionId: PropTypes.string,
    showError: PropTypes.bool,
    errorMessage: PropTypes.string,
  }),
  onUpdateFirstName: PropTypes.func,
  onUpdateLastName: PropTypes.func,
  onUpdateEmail: PropTypes.func,
  onUpdateTerms: PropTypes.func,
};

export default TeacherQuote;
