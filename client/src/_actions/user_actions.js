import axios from 'axios';
import {
  LOGIN_USER,
  GOOGLE_USER,
  FACEBOOK_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  FORGET_USER,
  RESET_USER,
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function googleLoginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/google-login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: GOOGLE_USER,
    payload: request,
  };
}

export function facebookLoginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/facebook-login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: FACEBOOK_USER,
    payload: request,
  };
}

export function forgetUser(dataToSubmit) {
  const request = axios
    .put(`${USER_SERVER}/forgot-password`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: FORGET_USER,
    payload: request,
  };
}

export function resetUser(dataToSubmit) {
  const request = axios
    .put(`${USER_SERVER}/reset-password`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: RESET_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
