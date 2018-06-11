import React from 'react';
import { shallow } from 'enzyme';

import NavOperator from '../index';

describe('<NavOperator />', () => {
  it('should render 1 div', () => {
    const renderedComponent = shallow(
      <NavOperator />
    );
    expect(renderedComponent.find('div').length).toBe(1);
  });
});
