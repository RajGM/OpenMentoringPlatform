import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import SponsoredTile from '../components/SponsoredTile'; // adjust the import path as needed

describe('SponsoredTile Component', () => {
  it('renders the "Sponsored" label', () => {
    const { getByText } = render(<SponsoredTile />);
    
    // Check if the "Sponsored" label is rendered
    expect(getByText('Sponsored')).toBeInTheDocument();
  });

  // Add more tests as needed, for example, you can test the styles, but that might be more involved and might require additional tools or methods.
});

