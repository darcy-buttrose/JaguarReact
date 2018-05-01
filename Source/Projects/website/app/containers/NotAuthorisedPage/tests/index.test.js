/**
 * Testing the NotFoundPage
 */

import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import NotAuthorised from '../index';

describe('<NotAuthorised />', () => {
  it('should render the Page Not Authorised text', () => {
    const renderedComponent = shallow(
      <NotAuthorised />
    );
    expect(renderedComponent.contains(
      <span>
        <FormattedMessage
          id="boilerplate.containers.NotAuthorisedPage.header"
          defaultMessage={'You need permission to access that page.'}
        />
      </span>)).toEqual(true);
  });
});
