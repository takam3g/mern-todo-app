import { FormInputError } from '../FormInput/FormInput.type';

export const validateUserInput = (
  username: string,
  password: string,
  setInputError: React.Dispatch<
    React.SetStateAction<Record<string, FormInputError>>
  >
) => {
  // Set error if any of the required fields are empty
  if (!username || !password) {
    setInputError({
      username: {
        isError: !username ? true : false,
        message: !username ? 'Username is required' : '',
      },
      password: {
        isError: !password ? true : false,
        message: !password ? 'Password is required' : '',
      },
    });
    return false;
  }

  return true;
};
