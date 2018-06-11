import React from 'react';
import { shallow } from 'enzyme';

import PoweredBy from '../index';

describe('<PoweredBy />', () => {
  it('should render 1 span', () => {
    const renderedComponent = shallow(
      <PoweredBy />
    );
    expect(renderedComponent.find('span').length).toBe(1);
  });
});
