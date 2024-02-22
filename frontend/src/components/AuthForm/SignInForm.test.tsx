// Test rendering username and password input fields
// Test functionality of sign in button with valid input
// Test functionality of sign in button with invalid input

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SignInForm, { validateUserInput } from './SignInForm';

describe('SignInForm', () => {
  test('rendering fields of username and password', () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('Should be able to type username and password', () => {
    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    const usernameInput: HTMLInputElement = screen.getByLabelText(/username/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/password/i);

    const username = 'testuser';
    const password = 'testpassword';
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });

    expect(usernameInput.value).toBe(username);
    expect(passwordInput.value).toBe(password);
  });

  test('validates feilds and submit the form', () => {
    // Mock onSubmit function
    const mockSubmit = jest.fn();

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    const form = screen.getByRole('form', { name: 'form' });
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    // Fill out the feilds (valid input)
    const username = 'testuser';
    const password = 'testpassword';
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });

    // Submit the form
    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(username, password, jest.fn());
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };

    // Submit the form
    fireEvent.click(signInButton);

    // Validation should pass
    expect(validateUserInput(username, password, jest.fn())).toBe(true);

    // It shuold submit the form
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('validates feilds, and do not submit when all fields are not valid', () => {
    // Mock onSubmit function
    const mockSubmit = jest.fn();

    render(
      <MemoryRouter>
        <SignInForm />
      </MemoryRouter>
    );

    const form = screen.getByRole('form', { name: 'form' });
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    // Fill out the feilds (empty input)
    const username = '';
    const password = '';
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(passwordInput, { target: { value: password } });

    // Submit the form
    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(username, password, jest.fn());
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };

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
