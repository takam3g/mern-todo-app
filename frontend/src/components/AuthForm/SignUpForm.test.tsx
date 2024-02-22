// Test rendering username, email, password and confirm password input fields
// Test functionality of sign up button with valid input
// Test functionality of sign up button with invalid input

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SignUpForm, { validateUserInput } from './SignUpForm';

describe('SignUpForm', () => {
  // Mock onSubmit function
  const mockSubmit = jest.fn();

  // Define elements
  let form: HTMLFormElement;
  let usernameInput: HTMLInputElement;
  let emailInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let confirmPasswordInput: HTMLInputElement;
  let signUpButton: HTMLButtonElement;

  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );
    form = screen.getByRole('form', { name: 'form' });
    usernameInput = screen.getByLabelText(/username/i);
    emailInput = screen.getByLabelText(/email/i);
    passwordInput = screen.getByLabelText(/^password$/i);
    confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    signUpButton = screen.getByRole('button', { name: /sign up/i });

    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(
        usernameInput.value,
        emailInput.value,
        passwordInput.value,
        confirmPasswordInput.value,
        jest.fn()
      );
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };
  });

  // Helper function to type into the form
  const typeIntoForm = (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword },
    });
  };

  test('rendering fields of username, email, password and confirm email', () => {
    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  test('Should be able to type username, email, password and confirm email fields', () => {
    const username = 'testuser';
    const email = 'testuser@email.com';
    const password = 'testpassword';
    const confirmPassword = 'testpassword';
    typeIntoForm(username, email, password, confirmPassword);

    expect(usernameInput.value).toBe(username);
    expect(emailInput.value).toBe(email);
    expect(passwordInput.value).toBe(password);
    expect(confirmPasswordInput.value).toBe(confirmPassword);
  });

  test('validates feilds and submit the form', () => {
    // Fill out the feilds (valid input)
    const username = 'testuser';
    const email = 'testuser@email.com';
    const password = 'testpassword';
    const confirmPassword = 'testpassword';
    typeIntoForm(username, email, password, confirmPassword);

    // Submit the form
    fireEvent.click(signUpButton);

    // Validation should pass
    expect(
      validateUserInput(username, email, password, confirmPassword, jest.fn())
    ).toBe(true);

    // It shuold submit the form
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('validates feilds, and do not submit when all fields are not valid', () => {
    // Fill out the feilds
    const username = ''; // Empty for required field
    const email = 'test.com'; // Invalid email
    const password = 'pw'; // Too short
    const confirmPassword = 'testpassword'; // Does not match
    typeIntoForm(username, email, password, confirmPassword);

    // Submit the form
    fireEvent.click(signUpButton);

    // Validation should not pass
    expect(
      validateUserInput(username, email, password, confirmPassword, jest.fn())
    ).not.toBe(true);

    // It should display error messages
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(
      screen.getByText(/password shoud be at least 8 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/password does not match/i)).toBeInTheDocument();

    // It should not submit the form
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
