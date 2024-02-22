import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import './AuthForm.scss';
import { validateUserInput } from './SignInForm.helper';
import FormInput from '../FormInput/FormInput';
import { FormInputError } from '../FormInput/FormInput.type';
import {
  SignInInput as SignInInputModel,
  signIn,
} from '../../services/user_api';
import { UserContext } from '../../contexts/UserContext';
import { UnauthorizedError } from '../../errors/http_errors';

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [submitErrorText, setSubmitErrorText] = useState<string>('');

  const [inputError, setInputError] = useState<Record<string, FormInputError>>({
    username: {
      isError: false,
      message: '',
    },
    password: {
      isError: false,
      message: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateUserInput(username, password, setInputError)) {
      const signInInput: SignInInputModel = {
        username: username,
        password: password,
      };

      setIsSubmitting(true);
      setSubmitErrorText('');

      try {
        // Sign in
        const user = await signIn(signInInput);
        // Save to the state
        setUser(user);
        // Redirect to the todo page
        navigate('/todo');
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          setSubmitErrorText(error.message);
        } else {
          console.error(error);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      className='auth-form'
      onSubmit={handleSubmit}
      aria-label='form'
      noValidate
    >
      <FormInput
        id='username'
        labelText='Username'
        type='text'
        isRequired={true}
        value={username}
        onChangeHandler={(e) => setUsername(e.target.value)}
        inputError={inputError.username}
      />
      <FormInput
        id='password'
        labelText='Password'
        type='password'
        isRequired={true}
        value={password}
        onChangeHandler={(e) => setPassword(e.target.value)}
        inputError={inputError.password}
      />
      <p className='submit-error'>{submitErrorText}</p>
      <button type='submit' disabled={isSubmitting}>
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
