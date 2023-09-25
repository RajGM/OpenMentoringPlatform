import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AuthCheck from '@components/AuthCheck';
import { UserContext } from '@lib/context';

// Mocking the useContext hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('AuthCheck component', () => {
  it('renders children if username is present', () => {
    (useContext as jest.Mock).mockReturnValue({ username: 'testUser' });

    render(
      <AuthCheck>
        <div>Logged in content</div>
      </AuthCheck>
    );

    expect(screen.getByText('Logged in content')).toBeInTheDocument();
    expect(screen.queryByText('You must be signed in')).not.toBeInTheDocument();
  });

  it('renders fallback if username is not present', () => {
    (useContext as jest.Mock).mockReturnValue({ username: null });

    render(
      <AuthCheck fallback={<div>Fallback content</div>}>
        <div>Logged in content</div>
      </AuthCheck>
    );

    expect(screen.getByText('Fallback content')).toBeInTheDocument();
    expect(screen.queryByText('Logged in content')).not.toBeInTheDocument();
  });

  it('renders default message if username is not present and no fallback provided', () => {
    (useContext as jest.Mock).mockReturnValue({ username: null });

    render(
      <AuthCheck>
        <div>Logged in content</div>
      </AuthCheck>
    );

    expect(screen.getByText('You must be signed in')).toBeInTheDocument();
    expect(screen.queryByText('Logged in content')).not.toBeInTheDocument();
  });
});
