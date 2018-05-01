import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CandidateFeatures from './CandidateFeatures';
import messages from './messages';

function CandidatePackage(props) {
  return (
    <div className="solution-box">
      <div className="solution-header-school-cms">
        <div className="solution-header-text"><FormattedMessage {...messages.header} /></div>
      </div>
      <div className="solution-box-body">
        <h4>
          <FormattedMessage {...messages.heading} />
        </h4>
        <CandidateFeatures />
        <button
          className="quote-button push-down-four"
          onClick={() => props.onSelectPackage('teacher_candidate')}
        ><FormattedMessage {...messages.create} /></button>
      </div>
    </div>
  );
}

CandidatePackage.propTypes = {
  onSelectPackage: PropTypes.func,
};

export default CandidatePackage;
