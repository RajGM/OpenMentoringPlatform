import { useEffect, useState } from "react";
import Loader from "@components/Loader";
import MentorTile from "@components/MentorTile/MentorTile";

//let dataToShow = [];

function CardField({ arrData }) {
  return arrData
    ? arrData.map((indiData) => (
        <div className="eventCard">
          {" "}
          <MentorTile data={indiData} key={indiData} />
        </div>
      ))
    : null;
}

//return arrData ? arrData.map((indiData) => <div className="eventCard"> <MentorTile data={indiData} key={indiData} /></div>) : null;

export default function MentorFeed({ oppData }) {
  const [loading, setLoading] = useState(true);
  console.log("oppData MENTORFEED:", oppData);
  useEffect(() => {
    console.log("oppData MENTORFEED LEN:", typeof oppData);
  }, [oppData]);

  // if (loading == true) {
  //     return (<div className='fullHeightMain'>
  //         <Loader show={true} className="middle" />
  //     </div>)
  // } else {
  if (oppData.length == 0) {
    return (
      <div
        className="fullHeightMain middle"
        style={{ backgroundColor: "pink" }}
      >
        <h1>Cleaning Data and testing multiple features integrations</h1>
        <h1>It will be completed by tomorrow, soon</h1>
        <h1>Sorry, no opportunities found!</h1>
        <h2>Please add some for the community</h2>
      </div>
    );
  } else {
    return (
      <div className="mainFeed fullHeightMain middle">
        <div>
          {oppData.length >= 1 ? (
            <CardField arrData={oppData} />
          ) : (
            <Loader show={true} className="middle" />
          )}
        </div>
      </div>
    );
  }
  //}
}

/*

let data = {
    title: "HackHarvard",
    Link: "https://hackharvard.io/",
    ApplicationDate: "2021-09-01",
    EventDate: "2021-09-01",
    PostedBy: "RajGM",
    Real: 0,
    Spam: 0,
    Sponsored: false
}

*/
