import React from 'react';
import { shallow } from 'enzyme';

import SignOut from '../index';

describe('<SignOut />', () => {
  it('should render 1 span', () => {
    const renderedComponent = shallow(
      <SignOut />
    );
    expect(renderedComponent.find('span').length).toBe(1);
  });
  it('should render 1 button', () => {
    const renderedComponent = shallow(
      <SignOut />
    );
    expect(renderedComponent.find('button').length).toBe(1);
  });
});
