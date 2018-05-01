// https://avinmathew.com/multiple-layouts-with-react-router-v4/
import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout>
        <Component {...props} />
      </Layout>
  )}
  />
);

AppRoute.propTypes = {
  component: PropTypes.func,
  layout: PropTypes.func,
};

export default AppRoute;
