import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ISSFeatures from './ISSFeatures';
import messages from './messages';

function ISS(props) {
  return (
    <div className="solution-box-iss">
      <div className="solution-header-teacher-iss">
        <div className="solution-header-text"><FormattedMessage {...messages.header} /></div>
      </div>
      <div className="solution-box-body">
        <h4>
          <FormattedMessage {...messages.heading} />
        </h4>
        <div className="background-line-iss"><FormattedMessage {...messages.plus} /></div>
        <ISSFeatures />
        <hr />
        <div className="solution-box-price">
          <FormattedMessage {...messages.price} />
          <span className="solution-box-price-period"><FormattedMessage {...messages.pricePeriod} /></span>
        </div>
        <button className="quote-button-iss push-down-two" onClick={() => props.onSelectPackage('teacher_iss')}><FormattedMessage {...messages.create} /></button>
      </div>
    </div>
  );
}

ISS.propTypes = {
  onSelectPackage: PropTypes.func,
};

export default ISS;
