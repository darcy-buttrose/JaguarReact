import { fromJS } from 'immutable';

import authReducer from '../reducer';
import {
  UPDATE_PROFILE_SUCCESS,
  LOGIN_REQUEST_SUCCESS,
  UPDATE_TOKEN,
} from '../constants';

describe('authReducer', () => {
  it('set user on login success', () => {
    const logedInState = authReducer(undefined, {
      type: LOGIN_REQUEST_SUCCESS,
      user: {
        id_token: 'token',
        profile: {
          name: 'ops',
        },
      },
    });

    expect(logedInState).toEqual(fromJS({
      user: {
        id_token: 'token',
        profile: {
          name: 'ops',
        },
      },
      userName: 'ops',
      isAuthenticated: true,
      isAuthenticating: false,
      showError: false,
      errorMessage: null,
    }));
  });

  it('update profile', () => {
    const logedInState = authReducer(undefined, {
      type: LOGIN_REQUEST_SUCCESS,
      user: {
        id_token: 'token',
        profile: {
          name: 'ops',
        },
      },
    });

    const updatedState = authReducer(logedInState, {
      type: UPDATE_PROFILE_SUCCESS,
      profile: {
        name: 'admin',
      },
    });

    expect(updatedState).toEqual(fromJS({
      user: {
        id_token: 'token',
        profile: {
          name: 'admin',
        },
      },
      userName: 'admin',
      isAuthenticated: true,
      isAuthenticating: false,
      showError: false,
      errorMessage: null,
    }));
  });

  it('update token', () => {
    const logedInState = authReducer(undefined, {
      type: LOGIN_REQUEST_SUCCESS,
      user: {
        id_token: 'token',
        profile: {
          name: 'ops',
        },
      },
    });

    const updatedState = authReducer(logedInState, {
      type: UPDATE_TOKEN,
      token: 'new',
    });

    expect(updatedState).toEqual(fromJS({
      user: {
        id_token: 'new',
        profile: {
          name: 'ops',
        },
      },
      userName: 'ops',
      isAuthenticated: true,
      isAuthenticating: false,
      showError: false,
      errorMessage: null,
    }));
  });
});
