import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import MemberFeatures from './MemberFeatures';
import messages from './messages';

function MemberPackage(props) {
  return (
    <div className="solution-box">
      <div className="solution-header-school-cms">
        <div className="solution-header-text"><FormattedMessage {...messages.header} /></div>
      </div>
      <div className="solution-box-body">
        <h4>
          <FormattedMessage {...messages.heading} />
        </h4>
        <div className="background-line-promo"><FormattedMessage {...messages.plus} /></div>
        <div className="push-down-two"></div>
        <MemberFeatures />
        <div className="push-down-four"></div>
        <hr />
        <div className="solution-box-price">
          <FormattedMessage {...messages.price} />
          <span className="solution-box-price-period"><FormattedMessage {...messages.pricePeriod} /></span>
        </div>
        <button className="quote-button push-down-two" onClick={() => props.onSelectPackage('teacher_member')}><FormattedMessage {...messages.create} /></button>
      </div>
    </div>
  );
}

MemberPackage.propTypes = {
  onSelectPackage: PropTypes.func,
};

export default MemberPackage;
