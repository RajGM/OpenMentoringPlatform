import { useState, useEffect } from "react";
import Image from "next/image";
import { firestore } from "@lib/firebase";

export default function MentorTile({ data }: any) {
  
  console.log("data:", data);

  return (
    <div className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 eventCard">
      <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

      <div className="sm:flex sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            {data.displayName}
          </h3>

          <p className="mt-1 text-xs font-medium text-gray-600">
            @{data.username}
          </p>
        </div>

        <div className="hidden sm:block sm:shrink-0">
          <img
            alt={data.displayName}
            src={data.photoURL}
            className="h-16 w-16 rounded-lg object-cover shadow-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="max-w-[40ch] text-sm text-gray-500">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. At velit
          illum provident a, ipsa maiores deleniti consectetur nobis et eaque.
        </p>
      </div>

      <div style={{ marginTop: "10px" }}>
        <a
          className="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          href={`/${data.username}`}
        >
          <span className="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"></span>

          <span className="relative block border border-current bg-white px-8 py-3">
            Check Profile
          </span>
        </a>
      </div>
    </div>
  );
}

/*

<div className="eventTile">
      <div>
        <img
          src={
            data.logoUrl ? data.logoUrl : "https://www.infiopp.com/favicon.ico"
          }
          alt="title"
          className="iconLogo"
        />
      </div>
      <div
        style={{ overflow: "hidden", textAlign: "center", maxHeight: "20px" }}
      >
        <a
          href={data.link}
          onMouseEnter={() => setDataToshow(data.link)}
          onMouseLeave={() => setDataToshow(data.eventN)}
          target="_blank"
        >
          {dataToshow}{" "}
        </a>
        <img
          src="export.png"
          alt="title"
          className="redirectIcon"
          onMouseEnter={() => setDataToshow(data.link)}
          onMouseLeave={() => setDataToshow(data.eventN)}
        />
      </div>
      <div>
        <div></div>
        <div></div>
      </div>
      <div className="tileData">
        <div style={{ textAlign: "left", width: "60%" }}>
          Application Starts:
        </div>
        <div style={{ textAlign: "right", width: "40%" }}>{data.appS}</div>
      </div>
      <div className="tileData">
        <div style={{ textAlign: "left", width: "60%" }}>
          Application Ends :
        </div>
        <div style={{ textAlign: "right", width: "40%" }}>{data.appE}</div>
      </div>
      <div className="tileData">
        <div style={{ textAlign: "left", width: "60%" }}>Hacking Begins :</div>
        <div style={{ textAlign: "right", width: "50%" }}>
          {data.eventS ? data.eventS : "No Mention"}
        </div>
      </div>
      <div className="tileData">
        <div style={{ textAlign: "left", width: "50%" }}>Hacking Ends:</div>
        <div style={{ textAlign: "right", width: "50%" }}>
          {data.eventE ? data.eventE : "No Mention"}
        </div>
      </div>
            <div className="space"></div>
            <div
              className="rowFlex itemCenter"
              style={{ backgroundColor: "whitesmoke" }}
            >
              <div
                className="margin-right"
                style={{ flexBasis: "90%", textAlign: "center", paddingLeft: "50px" }}
              >
                Posted by {data.postedBy}
              </div>
            </div>
            <div>
              <a href={"/mentors/id"} target="_blank">
                <button className="btn btn-outline btn-info">Profile</button>
              </a>
            </div>
          </div>


*/
