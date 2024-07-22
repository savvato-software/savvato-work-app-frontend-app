import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/login-page/LoginPage';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      get: jest.fn((header) => {
        if (header === 'Authorization') {
          return 'Bearer mock-token';
        }
        return null;
      }),
    },
    json: () => Promise.resolve({ username: 'mockUser' }),
  })
);

describe('LoginPage', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders the component', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Login');
    expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });

    expect(usernameInput.value).toBe('testUser');
    expect(passwordInput.value).toBe('testPass');
  });

  test('handles successful login', async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody).toEqual({ username: 'testUser', password: 'testPass' });

    const token = sessionStorage.getItem('jwtToken');
    expect(token).toBe('Bearer mock-token');
  });

  test('handles unsuccessful login', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        headers: {
          get: jest.fn(() => null),
        },
        json: () => Promise.resolve({}),
      })
    );

    render(<LoginPage />);

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });
});
