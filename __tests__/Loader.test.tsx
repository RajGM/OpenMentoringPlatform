/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // for the "toBeInTheDocument" matcher
import Loader from '../components/Loader';

describe('Loader component', () => {
  it('renders the loader when show is true', () => {
    const { getByTestId } = render(<Loader show={true} className="test-class" />);
    const loader = getByTestId('loader-div');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('loader');
    expect(loader).toHaveClass('test-class');
  });

  it('does not render the loader when show is false', () => {
    const { queryByTestId } = render(<Loader show={false} className="test-class" />);
    const loader = queryByTestId('loader-div');
    expect(loader).not.toBeInTheDocument();
  });
});

/**
 * @jest-environment jsdom
 */

/*
import { render } from '@testing-library/react'
import Home from '@/pages/index'

it('renders homepage unchanged', () => {
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})
*/