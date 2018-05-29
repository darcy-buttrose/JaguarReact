import PropTypes from 'prop-types';

const authPropTypes = {
  user: PropTypes.shape({
    id_token: PropTypes.string,
    session_state: PropTypes.string,
    access_token: PropTypes.string,
    token_type: PropTypes.string,
    scope: PropTypes.string,
    expires_at: PropTypes.number,
    profile: PropTypes.shape({
      sid: PropTypes.string,
      sub: PropTypes.string,
      auth_time: PropTypes.number,
      idp: PropTypes.string,
      amr: PropTypes.array,
      preferred_username: PropTypes.string,
      name: PropTypes.string,
      email: PropTypes.string,
      email_verified: PropTypes.bool,
      given_name: PropTypes.string,
      role: PropTypes.array,
      scope: PropTypes.string,
    }),
  }),
  userName: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isAuthenticating: PropTypes.bool,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default authPropTypes;
