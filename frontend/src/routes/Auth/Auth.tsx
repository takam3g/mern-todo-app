import React, { useState } from 'react';

import './Auth.scss';
import SignInForm from '../../components/AuthForm/SignInForm';
import SignUpForm from '../../components/AuthForm/SignUpForm';

const Auth: React.FC = () => {
  const [isSignUpForm, setIsSignUpForm] = useState<boolean>(false);

  return (
    <div className='auth-container'>
      <h1>TODO APP</h1>
      <div className='auth-form-container'>
        <h2>{isSignUpForm ? 'Sign Up' : 'Sign In'}</h2>
        {isSignUpForm ? <SignUpForm /> : <SignInForm />}
        {isSignUpForm ? (
          <p className='auth-form-bottom-message'>
            Already have an account?
            <span
              onClick={() => {
                setIsSignUpForm(!isSignUpForm);
              }}
            >
              Sign In
            </span>
          </p>
        ) : (
          <p className='auth-form-bottom-message'>
            Don't have an account yet?
            <span
              onClick={() => {
                setIsSignUpForm(!isSignUpForm);
              }}
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
