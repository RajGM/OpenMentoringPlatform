import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import ClickToCopy from '../components/ClickToCopy';

describe('ClickToCopy component', () => {
  let container: any;

  beforeEach(() => {
    const rendered = render(<ClickToCopy text="Sample text to copy" />);
    container = rendered.container;
  });

  it('renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('renders the copy icon initially', () => {
    const copyIcon = container.querySelector('svg');
    expect(copyIcon).toBeTruthy();
  });

  it('changes the button text to "Copied!" after clicking', async () => {
    const button = container.querySelector('button');
    fireEvent.click(button);

    await act(async () => {
      expect(button.textContent).toBe('Copied!');
    });
  });

  it('changes the button text back to the copy icon after 2 seconds', async () => {
    const button = container.querySelector('button');
    fireEvent.click(button);

    await new Promise(r => setTimeout(r, 2100)); // wait for 2.1 seconds

    const copyIcon = container.querySelector('svg');
    expect(copyIcon).toBeTruthy();
  });
});
