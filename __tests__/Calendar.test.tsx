import React from 'react';
import { render } from '@testing-library/react';
import Calendar from '../components/Calendar';

describe('Calendar component', () => {
  let container: any;

  beforeEach(() => {
    const rendered = render(<Calendar />);
    container = rendered.container;
  });

  it('renders without crashing', () => {
    expect(container).toBeTruthy();
  });

  it('renders the title "Google Calendar Links"', () => {
    expect(container.querySelector('h2').textContent).toBe('Google Calendar Links');
  });

  it('renders the subtitle "Import to Google Calendar"', () => {
    expect(container.querySelector('h5').textContent).toBe('Import to Google Calendar');
  });

  it('renders the correct number of CalendarLink components', () => {
    const calendarLinks = container.querySelectorAll('div[data-testid="calendar-link"]');
    expect(calendarLinks.length).toBe(4);
  });

});
