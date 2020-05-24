import {
  LOGIN_USER,
  GOOGLE_USER,
  FACEBOOK_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  FORGET_USER,
  RESET_USER,
} from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    case GOOGLE_USER:
      return { ...state, googleAuth: action.payload };
    case FACEBOOK_USER:
      return { ...state, facebookAuth: action.payload };
    case AUTH_USER:
      return { ...state, userData: action.payload };
    case LOGOUT_USER:
      return { ...state };
    case FORGET_USER:
      return { ...state, success: action.payload };
    case RESET_USER:
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
