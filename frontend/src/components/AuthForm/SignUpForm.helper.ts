import { FormInputError } from '../FormInput/FormInput.type';

export const validateUserInput = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  setInputError: React.Dispatch<
    React.SetStateAction<Record<string, FormInputError>>
  >
) => {
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
        isError: !email ? true : !isEmailValid(),
        message: !email
          ? 'Email is required'
          : !isEmailValid()
          ? 'Email is invarid'
          : '',
      },
      password: {
        isError: !password ? true : !isPasswordValid(),
        message: !password
          ? 'Password is required'
          : !isPasswordValid()
          ? 'Password shoud be at least 8 characters'
          : '',
      },
      confirmPassword: {
        isError: !confirmPassword ? true : !isConfirmPasswordMatch(),
        message: !confirmPassword
          ? 'Confirm Password'
          : !isConfirmPasswordMatch()
          ? 'Password does not match'
          : '',
      },
    });
    return false;
  }
  return true;
};
