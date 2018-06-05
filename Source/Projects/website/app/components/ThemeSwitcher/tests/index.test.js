import React from 'react';
import { shallow } from 'enzyme';

import ThemeSwitcher from '../index';

describe('<ThemeSwitcher />', () => {
  it('should render 1 link', () => {
    const renderedComponent = shallow(
      <ThemeSwitcher />
    );
    expect(renderedComponent.find('link').length).toBe(1);
  });
});
