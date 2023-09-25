import React, { useEffect, useState } from "react";
import Loader from "@components/Loader";
import MentorTile from "@components/MentorTile";
import { CardFieldProps, MentorFeedProps } from "@lib/types";

const CardField: React.FC<CardFieldProps> = ({ arrData }) => {
  return (
    <div style={{ display:'block' }}>
      {arrData
        ? arrData.map((indiData) => (
            <MentorTile data={indiData} key={indiData} />
          ))
        : null}
    </div>
  );
};

const MentorFeed: React.FC<MentorFeedProps> = ({ oppData }) => {
  const [loading, setLoading] = useState(true);
  console.log("oppData MENTORFEED:", oppData);
  useEffect(() => {
    console.log("oppData MENTORFEED LEN:", typeof oppData);
  }, [oppData]);

  if (oppData.length === 0) {
    return (
      <div className="fullHeightMain middle">
        <h1>Cleaning Data and testing multiple features integrations</h1>
        <h1>It will be completed, soon</h1>
        <h1>Sorry, no data found!</h1>
      </div>
    );
  } else {
    return (
      <div style={{ backgroundColor: "pink" }}>
        {oppData.length >= 1 ? (
          <CardField arrData={oppData} />
        ) : (
          <Loader show={true} className="middle" />
        )}
      </div>
    );
  }
};

export default MentorFeed;
