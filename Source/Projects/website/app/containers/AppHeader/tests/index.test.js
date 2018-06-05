import React from 'react';
import { shallow } from 'enzyme';
import '../../../../internals/mocks/localStorage';
import AppHeader from '../index';

require('isomorphic-fetch');

describe('<AppHeader />', () => {
  it('should render 1 header', () => {
    const renderedComponent = shallow(
      <AppHeader />
    );
    expect(renderedComponent.find('header').length).toBe(1);
  });
});
