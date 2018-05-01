import React from 'react';
import { shallow } from 'enzyme';

import Header from '../index';

describe('<Header />', () => {
  it('should render a header', () => {
    const renderedComponent = shallow(
      <Header />
    );
    expect(renderedComponent.find('header').length).toEqual(1);
  });
});
