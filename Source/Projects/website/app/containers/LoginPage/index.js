import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Form, Text } from 'react-form';
import FormData from 'form-data';

import makeSelectApp from '../../state/App/selectors';
import { loginStart, loginSuccess, loginFailure } from '../../state/Auth/actions';
import appPropTypes from '../../state/App/propTypes';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    console.log('app', props.app);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.onLogin();
  }

  onSubmit(value) {
    const { config } = this.props.app;
    const { clientAppSettings } = config;
    const loginUrl = `${clientAppSettings.apiScheme}${clientAppSettings.djangoUrl}portal/api/v1/login/`;
    const { username, password } = value;
    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    fetch(loginUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.status !== 200) {
          this.props.onLoginFailure(response.error());
        }
        return response.json();
      })
      .then((sessionData) => {
        const user = {
          session_key: sessionData.session_key,
          profile: {
            name: username,
          },
        };
        this.props.onLoginSuccess(user);
      })
      .catch((error) => {
        this.props.onLoginFailure(error);
      });
  }

  renderForm({ submitForm }) {
    return (
      <form onSubmit={submitForm}>
        <Text field="username" placeholder="User Name" />
        <Text field="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    );
  }

  render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        render={this.renderForm}
      />
    );
  }
}


LoginPage.propTypes = {
  app: PropTypes.shape(appPropTypes),
  onLogin: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  onLoginFailure: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    onLogin: () => dispatch(loginStart()),
    onLoginSuccess: (user) => {
      dispatch(loginSuccess(user));
    },
    onLoginFailure: (error) => dispatch(loginFailure(error)),
    dispatch,
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(LoginPage);
