import ClickToCopy from '@components/ClickToCopy';

export default function CalendarLink({ link, text }) {

    return (
        <div className='calendarDiv'>
            <div className="container" >
                <div className="content" >
                    {link}
                </div>
            </div>
            <div className="container" >
                <div className="content" style={{textAlign:'right'}}>
                    <ClickToCopy text={text} />
                </div>
            </div>
        </div>
    );
}