import React from 'react';
import { shallow } from 'enzyme';

import ProfileButton from '../index';

const username = 'test user';
const menuOpen = false;
const currentTheme = 'daylight';
const mockFunction = () => {};

const renderComponent = (props = {}) => shallow(
  <ProfileButton
    username={username}
    onLogout={mockFunction}
    onChangeTheme={mockFunction}
    currentTheme={currentTheme}
    menuOpen={menuOpen}
    {...props}
  />
);

describe('<ProfileButton />', () => {
  it('should render a <span> tag', () => {
    const renderedComponent = renderComponent();
    expect(renderedComponent.is('span')).toBe(true);
  });
});
