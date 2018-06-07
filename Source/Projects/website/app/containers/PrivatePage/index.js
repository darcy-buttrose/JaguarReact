import React from 'react';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement,
} from 'react-reflex';
import 'react-reflex/styles.css';
// import userIsAuthenticated from 'utils/userIsAuthenticated';

export class PrivatePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <ReflexContainer orientation="vertical">
        <ReflexElement>
          <div>
            Left Pane (resizeable)
          </div>
        </ReflexElement>

        <ReflexSplitter />

        <ReflexElement>
          <div>
            Right Pane (resizeable)
          </div>
        </ReflexElement>
      </ReflexContainer>
    );
  }
}

export default PrivatePage;
