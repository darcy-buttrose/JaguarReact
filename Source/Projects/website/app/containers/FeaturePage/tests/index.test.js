import React from 'react';
import { shallow } from 'enzyme';

import FeaturePage from '../index';

describe('<FeaturePage />', () => {
  it('should render its heading', () => {
    const renderedComponent = shallow(
      <FeaturePage />
    );
    expect(renderedComponent.contains(
      <h1>
        Hi there
      </h1>
    )).toBe(true);
  });
});
