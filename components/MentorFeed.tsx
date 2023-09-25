import React, { useEffect, useState } from "react";
import Loader from "@components/Loader";
import MentorTile from "@components/MentorTile";
import { CardFieldProps, MentorFeedProps } from "@lib/types";

const CardField: React.FC<CardFieldProps> = ({ arrData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {arrData
        ? arrData.map((indiData) => (
            <MentorTile data={indiData} key={indiData.id} />
          ))
        : null}
    </div>
  );
};

const MentorFeed: React.FC<MentorFeedProps> = ({ oppData }) => {
  useEffect(() => {}, [oppData]);

  if (oppData.length === 0) {
    return (
      <div className="fullHeightMain middle min-h-screen">
        <h1>Cleaning Data and testing multiple features integrations</h1>
        <h1>It will be completed, soon</h1>
        <h1>Sorry, no data found!</h1>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen">
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
