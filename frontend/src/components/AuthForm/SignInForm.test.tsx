// Test rendering username and password input fields
// Test functionality of sign in button with valid input
// Test functionality of sign in button with invalid input

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SignInForm from './SignInForm';
import { validateUserInput } from './SignInForm.helper';

describe('SignInForm', () => {
  // Mock onSubmit function
  const mockSubmit = jest.fn();

  // Define elements
  let form: HTMLFormElement;
  let usernameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let signInButton: HTMLButtonElement;

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );
    form = screen.getByRole('form', { name: 'form' });
    usernameInput = screen.getByLabelText(/username/i);
    passwordInput = screen.getByLabelText(/password/i);
    signInButton = screen.getByRole('button', { name: /sign in/i });

    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(
        usernameInput.value,
        passwordInput.value,
        jest.fn()
      );
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };
  });

  // Helper function to type into the form
  const typeIntoForm = (username: string, password: string) => {
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });
  };

  test('rendering fields of username and password', () => {
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('Should be able to type username and password', () => {
    const username = 'testuser';
    const password = 'testpassword';
    typeIntoForm(username, password);

    expect(usernameInput.value).toBe(username);
    expect(passwordInput.value).toBe(password);
  });

  test('validates feilds and submit the form', () => {
    // Fill out the feilds (valid input)
    const username = 'testuser';
    const password = 'testpassword';
    typeIntoForm(username, password);

    // Submit the form
    fireEvent.click(signInButton);

    // Validation should pass
    expect(validateUserInput(username, password, jest.fn())).toBe(true);

    // It shuold submit the form
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('validates feilds, and do not submit when all fields are not valid', () => {
    // Fill out the feilds (empty input)
    const username = '';
    const password = '';
    typeIntoForm(username, password);

    // Submit the form
    fireEvent.click(signInButton);

    // Validation should not pass
    expect(validateUserInput(username, password, jest.fn())).not.toBe(true);

    // It should display error messages
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // It should not submit the form
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
