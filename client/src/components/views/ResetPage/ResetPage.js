import React from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { resetUser } from '../../../_actions/user_actions';
import { useDispatch } from 'react-redux';

import { Form, Input, Button, message } from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

function ResetPage(props) {
  const dispatch = useDispatch();
  const token = props.match.params.token;

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
        token: token,
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            newPassword: values.password,
            resetPasswordLink: values.token,
          };

          dispatch(resetUser(dataToSubmit))
            .then((response) => {
              if (response.payload.success === true) {
                props.history.push('/login');
                message.success(response.payload.message);
              }
            })
            .catch((err) => {
              props.history.push('/users/password/forget');
              message.error(err.response.data.message);
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
            <h2>Reset Password</h2>
            <Form
              style={{ minWidth: '375px' }}
              {...formItemLayout}
              onSubmit={handleSubmit}
            >
              <Form.Item
                required
                label='Password'
                hasFeedback
                validateStatus={
                  errors.password && touched.password ? 'error' : 'success'
                }
              >
                <Input
                  id='password'
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

              <Form.Item
                required
                label='Confirm'
                hasFeedback
                validateStatus={
                  errors.confirmPassword && touched.confirmPassword
                    ? 'error'
                    : 'success'
                }
              >
                <Input
                  id='confirmPassword'
                  placeholder='Enter your confirm password'
                  type='password'
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? 'text-input error'
                      : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className='input-feedback'>{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  onClick={handleSubmit}
                  type='primary'
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default ResetPage;
