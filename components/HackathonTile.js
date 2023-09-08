import { useState, useEffect } from 'react';
import ModalButton from './Modal';
import SponsoredTile from './SponsoredTile';
import HoverMenuButton from './HoverMenuButton';

export default function TestTile({ data }) {
    const [dataToshow, setDataToshow] = useState(data.eventN);

    useEffect(() => {
        setDataToshow(data.eventN);
    }, [data.eventN]);

    console.log("data:", data);

    return (
        <div className="eventTile">
            <div className="space" style={{ paddingLeft: '10px' }} >
                {
                    data.sponsored ? <SponsoredTile /> : ""
                }
            </div>
            <div>
                <img src={data.logoUrl ? data.logoUrl : "https://www.infiopp.com/favicon.ico"} alt="title" className="iconLogo" />
            </div>
            <div style={{ overflow: "hidden", textAlign: 'center', maxHeight: '20px' }}>
                <a href={data.link} onMouseEnter={() => setDataToshow(data.link)} onMouseLeave={() => setDataToshow(data.eventN)} target="_blank">{dataToshow} </a>
                <img src="export.png" alt="title" className="redirectIcon" onMouseEnter={() => setDataToshow(data.link)} onMouseLeave={() => setDataToshow(data.eventN)} />
            </div>
            <div>
                <div>

                </div>
                <div>

                </div>
            </div>
            <div className='tileData'>
                <div style={{textAlign:'left', width:'60%'}}>
                    Application Starts:
                </div>
                <div style={{textAlign:'right',width:'40%'}}>
                    {data.appS}
                </div>
            </div>
            <div className='tileData'>
                <div style={{textAlign:'left', width:'60%'}}>
                    Application Ends :
                </div>
                <div style={{textAlign:'right',width:'40%'}}>
                    {data.appE}
                </div>
            </div>
            <div className='tileData'>
                <div style={{textAlign:'left', width:'60%'}}>
                    Hacking Begins :
                </div>
                <div style={{textAlign:'right',width:'50%'}}>
                {data.eventS ? data.eventS : "No Mention"}
                </div>
            </div>
            <div className='tileData'>
                <div style={{textAlign:'left', width:'50%'}}>
                    Hacking Ends:
                </div>
                <div style={{textAlign:'right',width:'50%'}}>
                    {data.eventE ? data.eventE : "No Mention"}
                </div>
            </div>
            <div >
                <ModalButton eventData={data} />
            </div>
            <div className="space"></div>
            <div className="rowFlex itemCenter" style={{ backgroundColor: 'whitesmoke' }}>
                <div className='margin-right' style={{ flexBasis: '90%', textAlign: 'center', paddingLeft: '50px' }}>
                    Posted by {data.postedBy}
                </div>
                <div style={{ paddingLeft: '10px' }}>
                    <HoverMenuButton data={data} />
                </div>
            </div>
        </div>
    );
}

/*

<div>
                    Application Starts:{data.appS}
                </div>
                <div>
                    {data.appE ? "Application Ends: " + data.appE : "Application Ends: Not Specified"}
                </div>
                <div>
                    {data.eventS ? "Hacking Begins: " + data.eventS : "Hacking Starts: Not Specified"}
                </div>
                <div>
                    {data.eventE ? "Hacking Ends: " + data.eventE : "Hacking Ends: Not Specified"}
                </div>

*/