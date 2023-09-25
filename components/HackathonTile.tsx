import React, { useState, useEffect } from "react";
import ModalButton from "./Modal";
import SponsoredTile from "./SponsoredTile";
import HoverMenuButton from "./HoverMenuButton";
import { HackathonTileProps } from "@lib/types";

const HackathonTile: React.FC<HackathonTileProps> = ({ data }) => {
  const [dataToshow, setDataToshow] = useState<string>(data.eventN);

  useEffect(() => {
    setDataToshow(data.eventN);
  }, [data.eventN]);

  const absoluteLink =
    data.link.startsWith("http://") || data.link.startsWith("https://")
      ? data.link
      : "http://" + data.link;

  return (
    <div className="eventTile bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      <div className="mb-2 pl-2">{data.sponsored && <SponsoredTile />}</div>
      <div className="mb-2">
        <img
          src={
            data.logoUrl ? data.logoUrl : "https://www.infiopp.com/favicon.ico"
          }
          alt="title"
          className="iconLogo w-16 h-16 object-cover rounded-full"
        />
      </div>
      <div className="mb-2 overflow-hidden text-center h-7">
        <a
          href={absoluteLink}
          onMouseEnter={() => setDataToshow(data.link)}
          onMouseLeave={() => setDataToshow(data.eventN)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {dataToshow}
        </a>
        <img
          src="export.png"
          alt="title"
          className="redirectIcon ml-2 w-5 h-5 inline-block"
          onMouseEnter={() => setDataToshow(data.link)}
          onMouseLeave={() => setDataToshow(data.eventN)}
        />
      </div>

      <div className="mb-2 space-y-2">
        <div className="tileData flex justify-between">
          <div className="text-left w-3/5">Application Starts:</div>
          <div className="text-right w-2/5">{data.appS}</div>
        </div>
        <div className="tileData flex justify-between">
          <div className="text-left w-3/5">Application Ends:</div>
          <div className="text-right w-2/5">{data.appE}</div>
        </div>
        <div className="tileData flex justify-between">
          <div className="text-left w-3/5">Hacking Begins:</div>
          <div className="text-right w-2/5">
            {data.eventS ? data.eventS : "No Mention"}
          </div>
        </div>
        <div className="tileData flex justify-between">
          <div className="text-left w-3/5">Hacking Ends:</div>
          <div className="text-right w-2/5">
            {data.eventE ? data.eventE : "No Mention"}
          </div>
        </div>
      </div>
      <div className="mb-2 mt-4 w-full">
        <ModalButton eventData={data} />
      </div>
      <div className="mb-2"></div>
      <div></div>
      <div className="rowFlex itemCenter bg-gray-100 p-2 rounded-lg flex items-center w-full mt-2">
        <div className="flex-grow text-center pl-4">
          Posted by {data.postedBy}
        </div>
        <div className="flex items-center pl-4">
          <HoverMenuButton data={data} />
        </div>
      </div>
    </div>
  );
};

export default HackathonTile;
