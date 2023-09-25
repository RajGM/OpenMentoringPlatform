import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import UserProfile from '../components/UserProfile'; // adjust the import path as needed

describe('UserProfile Component', () => {
  it('renders user profile with provided values', () => {
    const mockUser = {
      photoURL: 'https://example.com/photo.jpg',
      username: 'testuser',
      displayName: 'Test User'
    };

    const { getByAltText, getByText } = render(<UserProfile user={mockUser} />);
    
    // Check if the provided image is rendered
    expect(getByAltText('User profile image')).toHaveAttribute('src', mockUser.photoURL);

    // Check if the provided username and display name are rendered
    expect(getByText(`@${mockUser.username}`)).toBeInTheDocument();
    expect(getByText(mockUser.displayName)).toBeInTheDocument();
  });

  it('renders default values for missing user properties', () => {
    const mockUser = {};

    const { getByAltText, getByText } = render(<UserProfile user={mockUser} />);
    
    // Check if the default image is rendered
    expect(getByAltText('User profile image')).toHaveAttribute('src', '/hacker.png');

    // Check if the default display name is rendered
    expect(getByText('Anonymous User')).toBeInTheDocument();
  });

  // Add more tests as needed
});
