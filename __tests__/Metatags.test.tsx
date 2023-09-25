import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import Metatags from '../components/Metatags'; // adjust the import path as needed

describe('Metatags Component', () => {
  it('renders meta tags with default values', () => {
    render(<Metatags />);
    
    // Check if the default title is set
    expect(document.title).toBe('FOSS Mentoring');

    // Check if the default meta tags are set
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('FOSS Mentoring');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe('A Free and Open Mentoring Platform');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('FOSS Mentoring');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('A Free and Open Mentoring Platform');
  });

  it('renders meta tags with provided values', () => {
    render(<Metatags title="Custom Title" description="Custom Description" />);
    
    // Check if the provided title is set
    expect(document.title).toBe('Custom Title');

    // Check if the provided meta tags are set
    expect(document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('Custom Title');
    expect(document.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe('Custom Description');
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Custom Title');
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe('Custom Description');
  });

  // Add more tests as needed
});
