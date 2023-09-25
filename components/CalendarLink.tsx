import React from 'react';
import ClickToCopy from '@components/ClickToCopy';
import { CalendarLinkProps } from '@lib/types';

const CalendarLink: React.FC<CalendarLinkProps> = ({ link, text }) => {
    return (
        <div className='calendarDiv' data-testid="calendar-link">
            <div className="container">
                <div className="content">
                    {link}
                </div>
            </div>
            <div className="container">
                <div className="content" style={{ textAlign: 'right' }}>
                    <ClickToCopy text={text} />
                </div>
            </div>
        </div>
    );
}

export default CalendarLink;
