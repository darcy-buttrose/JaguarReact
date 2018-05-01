/*
 * FeaturePage
 *
 * List all the features
 */
import React from 'react';
import { Helmet } from 'react-helmet';

export default class FeaturePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  // Since state and props are static,
  // there's no need to re-render this component
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="container" >
        <div className="row">
          <div className="twelve columns">
            <main>
              <Helmet>
                <title>Features</title>
                <meta name="Features" content="The easiest way to find your next teaching job overseas. Search our database of top international schools seeking qualified teachers." />
              </Helmet>
              <div>
                <h1>Features</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}
