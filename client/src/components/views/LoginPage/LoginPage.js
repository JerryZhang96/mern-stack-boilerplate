import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import {
  loginUser,
  googleLoginUser,
  facebookLoginUser,
} from '../../../_actions/user_actions';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Icon, Input, Button, Checkbox, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import { GOOGLE_CLIENT, FACEBOOK_CLIENT } from '../../Config.js';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { FacebookFilled } from '@ant-design/icons';

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem('rememberMe') ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialState = JSON.parse(window.localStorage.getItem('rememberMe'))
    ? JSON.parse(window.localStorage.getItem('rememberMe'))
    : '';

  const sendGoogleToken = (tokenId) => {
    let dataToSubmit = {
      idToken: tokenId,
    };
    dispatch(googleLoginUser(dataToSubmit))
      .then((response) => {
        if (response.payload.loginSuccess) {
          window.localStorage.setItem('google_token', response.payload.token);
          window.localStorage.setItem(
            'google_tokenExp',
            response.payload.tokenExp
          );
          window.localStorage.setItem('userId', response.payload.userId);
          props.history.push('/');
        }
      })
      .catch((err) => {
        console.log('Google Sign In Error', err.response);
        alert('Google Sign In Error', err.response);
      });
  };

  const responseGoogle = (response) => {
    sendGoogleToken(response.tokenId);
  };

  const sendFacebookToken = (userID, accessToken) => {
    let dataToSubmit = {
      userID,
      accessToken,
    };

    dispatch(facebookLoginUser(dataToSubmit))
      .then((response) => {
        if (response.payload.loginSuccess) {
          window.localStorage.setItem('facebook_token', response.payload.token);
          window.localStorage.setItem(
            'facebook_tokenExp',
            response.payload.tokenExp
          );
          window.localStorage.setItem('userId', response.payload.userId);
          props.history.push('/');
        }
      })
      .catch((err) => {
        console.log('Facebook Sign In Error', err.response);
        alert('Facebook Sign In Error', err.response);
      });
  };

  const responseFacebook = (response) => {
    sendFacebookToken(response.userID, response.accessToken);
  };

  return (
    <Formik
      initialValues={{
        email: initialState.email,
        password: initialState.password,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem('x_token', response.payload.token);
                window.localStorage.setItem(
                  'x_tokenExp',
                  response.payload.tokenExp
                );
                window.localStorage.setItem('userId', response.payload.userId);
                if (rememberMe === true) {
                  window.localStorage.setItem(
                    'rememberMe',
                    JSON.stringify(values)
                  );
                } else {
                  localStorage.removeItem('rememberMe');
                }
                props.history.push('/');
              } else {
                setFormErrorMessage('Check out your Account or Password again');
              }
            })
            .catch((err) => {
              setFormErrorMessage('Check out your Account or Password again');
              setTimeout(() => {
                setFormErrorMessage('');
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className='app'>
            <Title level={2}>Log In</Title>
            <form onSubmit={handleSubmit} style={{ width: '350px' }}>
              <Form.Item required>
                <Input
                  id='email'
                  prefix={
                    <Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='Enter your email'
                  type='email'
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className='input-feedback'>{errors.email}</div>
                )}
              </Form.Item>
              <Form.Item required>
                <Input
                  id='password'
                  prefix={
                    <Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='Enter your password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className='input-feedback'>{errors.password}</div>
                )}
              </Form.Item>
              {formErrorMessage && (
                <label>
                  <p
                    style={{
                      color: '#ff0000bf',
                      fontSize: '0.7rem',
                      border: '1px solid',
                      padding: '1rem',
                      borderRadius: '10px',
                    }}
                  >
                    {formErrorMessage}
                  </p>
                </label>
              )}
              <Form.Item>
                <Checkbox
                  id='rememberMe'
                  onChange={handleRememberMe}
                  checked={rememberMe}
                >
                  Remember me
                </Checkbox>
                <a
                  className='login-form-forgot'
                  href='/users/password/forget'
                  style={{ float: 'right' }}
                >
                  Forgot password
                </a>
                <div>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ minWidth: '100%' }}
                    disabled={isSubmitting}
                    onSubmit={handleSubmit}
                  >
                    Login
                  </Button>
                </div>
              </Form.Item>
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '15px',
                  marginBottom: '20px',
                }}
              >
                Or login with
              </div>
              <Form.Item>
                <GoogleLogin
                  clientId={`${GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  render={(renderProps) => (
                    <Button
                      block
                      type='danger'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      Google
                    </Button>
                  )}
                />
                <FacebookLogin
                  appId={`${FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <Button block type='primary' onClick={renderProps.onClick}>
                      Facebook
                    </Button>
                  )}
                />
              </Form.Item>
              Don't have an account?<a href='/register'>&nbsp;Sign up now!</a>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
