import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import PromotionsList from './promotionslist';
import messages from './messages';

function Promotions(props) {
  return (
    <div className="solution-box">
      <div className="solution-header-school-promo">
        <div className="solution-header-text-plus"><FormattedMessage {...messages.header} /></div>
      </div>
      <div className="solution-box-body">
        <h4>
          <FormattedMessage {...messages.heading} />
        </h4>
        <div className="background-line-promo"><FormattedMessage {...messages.plus} /></div>
        <PromotionsList />
        <button className="quote-button push-down-one" onClick={() => props.onSelectPackage('2')}><FormattedMessage {...messages.goToQuote} /></button>
      </div>
    </div>
  );
}

Promotions.propTypes = {
  onSelectPackage: PropTypes.func,
};

export default Promotions;
