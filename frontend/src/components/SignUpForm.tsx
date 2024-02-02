import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/AuthForm.styles.scss';
import FormInput from './FormInput';
import { SignUpInput as SignUpInputModel, signUp } from '../services/user_api';
import { UserContext } from '../contexts/UserContext';
import { ConflictError } from '../errors/http_errors';

const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [submitErrorText, setSubmitErrorText] = useState<string>('');

  interface InputError {
    isError: boolean;
    message: string;
  }

  const [inputError, setInputError] = useState<Record<string, InputError>>({
    username: {
      isError: false,
      message: '',
    },
    email: {
      isError: false,
      message: '',
    },
    password: {
      isError: false,
      message: '',
    },
    confirmPassword: {
      isError: false,
      message: '',
    },
  });

  const validateUserInput = () => {
    const isEmailValid = () => {
      const requiredFormat = /\S+@\S+\.\S+/;
      return requiredFormat.test(email);
    };

    // For now just setting at least 8 characters long
    const isPasswordValid = () => {
      const requiredFormat = /^.{8,}$/;
      return requiredFormat.test(password);
    };

    const isConfirmPasswordMatch = () => {
      return password === confirmPassword;
    };

    // Set error if any of the required fields are empty
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !isEmailValid() ||
      !isPasswordValid() ||
      !isConfirmPasswordMatch()
    ) {
      setInputError({
        username: {
          isError: !username ? true : false,
          message: !username ? 'Username is required' : '',
        },
        email: {
          isError: !email ? true : false,
          message: !email
            ? 'Email is required'
            : !isEmailValid()
            ? 'Email is invarid'
            : '',
        },
        password: {
          isError: !password ? true : false,
          message: !password
            ? 'Password is required'
            : !isEmailValid()
            ? 'Password shoud be at least 8 characters'
            : '',
        },
        confirmPassword: {
          isError: !confirmPassword ? true : false,
          message: !confirmPassword
            ? 'Confirm Password'
            : !isConfirmPasswordMatch
            ? 'Password does not match'
            : '',
        },
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateUserInput()) {
      const signUpInput: SignUpInputModel = {
        username: username,
        email: email,
        password: password,
      };

      setIsSubmitting(true);
      setSubmitErrorText('');

      try {
        // Sign up
        const user = await signUp(signUpInput);
        // Save to the state
        setUser(user);
        // Redirect to the todo page
        navigate('/todo');
      } catch (error) {
        if (error instanceof ConflictError) {
          console.log('it is 409!');
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
    <form className='auth-form' onSubmit={handleSubmit} noValidate>
      <FormInput
        id='username'
        labelText='Username'
        type='text'
        placeholder='John'
        isRequired={true}
        value={username}
        onChangeHandler={(e) => setUsername(e.target.value)}
        inputError={inputError.username}
      />
      <FormInput
        id='email'
        labelText='Email'
        type='email'
        placeholder='john.smith@emil.com'
        isRequired={true}
        value={email}
        onChangeHandler={(e) => setEmail(e.target.value)}
        inputError={inputError.email}
      />
      <FormInput
        id='password'
        labelText='Password'
        type='password'
        placeholder='At least 8 characters long'
        isRequired={true}
        value={password}
        onChangeHandler={(e) => setPassword(e.target.value)}
        inputError={inputError.password}
      />
      <FormInput
        id='confirmPassword'
        labelText='Confirm Password'
        type='password'
        placeholder=''
        isRequired={true}
        value={confirmPassword}
        onChangeHandler={(e) => setConfirmPassword(e.target.value)}
        inputError={inputError.confirmPassword}
      />

      <p className='submit-error'>{submitErrorText}</p>
      <button type='submit' disabled={isSubmitting}>
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
