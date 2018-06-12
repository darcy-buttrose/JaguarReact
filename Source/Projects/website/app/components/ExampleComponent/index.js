/**
*
* ExampleComponent
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function ExampleComponent() {
  return (
    <div>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

ExampleComponent.propTypes = {

};

export default ExampleComponent;
