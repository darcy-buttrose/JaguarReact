import React from 'react';
import { shallow } from 'enzyme';

import StatusBar from '../index';

describe('<StatusBar />', () => {
  it('should render 1 footer', () => {
    const renderedComponent = shallow(
      <StatusBar />
    );
    expect(renderedComponent.find('footer').length).toBe(1);
  });
});
