import { useState, useEffect } from "react";
import Image from "next/image";

// import ModalButton from './Modal';
// import HoverMenuButton from './HoverMenuButton';
//       <Image src={data.logoUrl ? data.logoUrl : "https://www.infiopp.com/favicon.ico"} alt="title" height="20" width="20" className="iconLogo"/>

export default function MentorTile({ data }:any) {
  const [dataToshow, setDataToshow] = useState(data.eventN);

  useEffect(() => {
    setDataToshow(data.eventN);
  }, [data.eventN]);

  console.log("data:", data);

  return (
    <div
      className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
    >
      <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

      <div className="sm:flex sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            Investing in a SaaS product at early age
          </h3>

          <p className="mt-1 text-xs font-medium text-gray-600">John Doe</p>
        </div>

        <div className="hidden sm:block sm:shrink-0">
          <img
            alt="Paul Clapton"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
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

      <dl className="mt-6 flex gap-4 sm:gap-6">
        <div className="flex flex-col-reverse">
          <dt className="text-sm font-medium text-gray-600">Member Since</dt>
          <dd className="text-xs text-gray-500">31st June, 2021</dd>
        </div>

        <div className="flex flex-col-reverse">
          <dt className="text-sm font-medium text-gray-600">Total Investment</dt>
          <dd className="text-xs text-gray-500">$500k</dd>
        </div>
      </dl>

      <div style={{marginTop:'10px'}}>
              <a
                className="group relative inline-block text-sm font-medium text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                href="/mentors/asd"
              >
                <span className="absolute inset-0 translate-x-0 translate-y-0 bg-indigo-600 transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"></span>

                <span className="relative block border border-current bg-white px-8 py-3">
                  Check Portfolio
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
