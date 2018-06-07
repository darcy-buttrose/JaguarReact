import React from 'react';
import { shallow } from 'enzyme';

import SideBar from '../index';

describe('<SideBar />', () => {
  it('should render 1 div', () => {
    const renderedComponent = shallow(
      <SideBar />
    );
    expect(renderedComponent.find('div').length).toBe(1);
  });
});
