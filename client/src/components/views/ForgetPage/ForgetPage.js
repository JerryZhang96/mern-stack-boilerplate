import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { forgetUser } from '../../../_actions/user_actions';
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

function ForgetPage(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
      })}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
          };

          dispatch(forgetUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              message.success(response.payload.message);
            } else {
              message.error(response.payload.message);
            }
          });
          resetForm();
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
            <h2>Forget Password</h2>
            <Form
              style={{ minWidth: '375px' }}
              {...formItemLayout}
              onSubmit={handleSubmit}
            >
              <Form.Item
                required
                label='Email'
                hasFeedback
                validateStatus={
                  errors.email && touched.email ? 'error' : 'success'
                }
              >
                <Input
                  id='email'
                  placeholder='Enter your Email'
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

export default ForgetPage;
