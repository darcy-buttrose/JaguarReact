import React from 'react';
import { render } from 'enzyme';

import SideBar from '../index';

describe('<SideBar />', () => {
  it('should render 1 div', () => {
    const renderedComponent = render(
      <SideBar />
    );
    expect(renderedComponent.find('div').length).toBe(1);
  });
});
