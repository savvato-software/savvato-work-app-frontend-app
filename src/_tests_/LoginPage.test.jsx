import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import LoginPage from '../pages/login-page/LoginPage';

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((url, options) => {
    const headers = {
      get: jest.fn((header) => {
        if (header === 'Authorization') {
          return 'Bearer mock-token';
        }
        return null;
      }),
    };

    return Promise.resolve({
      ok: url === '/public/login' && options.body.includes('testUser') && options.body.includes('testPass'),
      headers,
      json: () => Promise.resolve({ username: 'mockUser' }),
    });
  });
  sessionStorage.clear();
});

afterEach(() => {
  global.fetch.mockRestore();
});

test('renders the component', () => {
  act(() => {
    rtlRender(<LoginPage />);
  });
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Login');
  expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('handles user input', () => {
  act(() => {
    rtlRender(<LoginPage />);
  });

  const usernameInput = screen.getByPlaceholderText('Enter your username');
  const passwordInput = screen.getByPlaceholderText('Enter your password');

  act(() => {
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
  });

  expect(usernameInput.value).toBe('testUser');
  expect(passwordInput.value).toBe('testPass');
});

test('handles successful login', async () => {
  act(() => {
    rtlRender(<LoginPage />);
  });

  const usernameInput = screen.getByPlaceholderText('Enter your username');
  const passwordInput = screen.getByPlaceholderText('Enter your password');
  const loginButton = screen.getByRole('button', { name: /login/i });

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
    fireEvent.click(loginButton);
  });

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
  expect(requestBody).toEqual({ username: 'testUser', password: 'testPass' });

  const token = sessionStorage.getItem('jwtToken');
  expect(token).toBe('Bearer mock-token');
});

test('handles unsuccessful login', async () => {
  jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      headers: {
        get: jest.fn(() => null),
      },
      json: () => Promise.resolve({})
    })
  );

  act(() => {
    rtlRender(<LoginPage />);
  });

  const usernameInput = screen.getByPlaceholderText('Enter your username');
  const passwordInput = screen.getByPlaceholderText('Enter your password');
  const loginButton = screen.getByRole('button', { name: /login/i });

  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPass' } });
    fireEvent.click(loginButton);
  });

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  const errorMessage = await waitFor(() => screen.getByText('Login failed'));
  expect(errorMessage).toBeInTheDocument();
});
