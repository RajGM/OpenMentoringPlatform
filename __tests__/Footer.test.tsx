import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import Footer from '../components/Footer'; // adjust the import path as needed

describe('Footer Component', () => {
  it('renders without crashing', () => {
    const { getByText, getByHref } = render(<Footer />);
    
    // Check if the "FOSS Mentoring" text is rendered
    expect(getByText('FOSS Mentoring')).toBeInTheDocument();

    // Check if the "Built by @RajGM" text is rendered
    expect(getByText('Built by')).toBeInTheDocument();
    expect(getByText('@RajGM')).toHaveAttribute('href', 'https://github.com/RajGM');
  });

});
