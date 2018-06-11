import React from 'react';
import { shallow } from 'enzyme';

import AppHeaderLogo from '../index';

describe('<AppHeaderLogo />', () => {
  it('should render 1 span', () => {
    const renderedComponent = shallow(
      <AppHeaderLogo />
    );
    expect(renderedComponent.find('span').length).toBe(1);
  });
});
