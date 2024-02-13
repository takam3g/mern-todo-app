// Test rendering username, email, password and confirm password input fields
// Test functionality of sign up button with valid input
// Test functionality of sign up button with invalid input

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import SignUpForm, { validateUserInput } from './SignUpForm';

describe('SignUpForm', () => {
  test('rendering fields of username and password', () => {
    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );

    const form = screen.getByRole('form', { name: 'form' });
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  test('validates feilds and submit the form', () => {
    // Mock onSubmit function
    const mockSubmit = jest.fn();

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );

    const form = screen.getByRole('form', { name: 'form' });
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    // Fill out the feilds (valid input)
    const username = 'testuser';
    const email = 'testuser@test.email';
    const password = 'testpassword';
    const passwordConfirm = 'testpassword';
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPasswordInput },
    });

    // Submit the form
    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(
        username,
        email,
        password,
        passwordConfirm,
        jest.fn()
      );
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };

    // Submit the form
    fireEvent.click(signUpButton);

    // Validation should pass
    expect(
      validateUserInput(username, email, password, passwordConfirm, jest.fn())
    ).toBe(true);

    // It shuold submit the form
    expect(mockSubmit).toHaveBeenCalled();
  });

  test('validates feilds, and do not submit when all fields are not valid', () => {
    // Mock onSubmit function
    const mockSubmit = jest.fn();

    render(
      <MemoryRouter>
        <SignUpForm />
      </MemoryRouter>
    );

    const form = screen.getByRole('form', { name: 'form' });
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    // Fill out the feilds
    const username = 'testuser';
    const email = 'test.com';
    const password = 'testpassword';
    const confirmPassword = 'testpassword';
    fireEvent.change(usernameInput, { target: { value: username } });
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword },
    });

    // Submit the form
    form.onsubmit = (e) => {
      e.preventDefault();
      const isValid = validateUserInput(
        username,
        email,
        password,
        confirmPassword,
        jest.fn()
      );
      if (isValid) {
        // Only if fields are valid, submit the form
        mockSubmit();
      }
    };

    fireEvent.click(signUpButton);

    // Validation should not pass
    expect(
      validateUserInput(username, email, password, confirmPassword, jest.fn())
    ).not.toBe(true);

    // It should not submit the form
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
