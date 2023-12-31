import React from 'react';
import CategoryBar from "@components/CategoryBar";
import MainFeed from "@components/MainFeed";

const Opp: React.FC = () => {
  return (
    <div className="middle" >
      <div className="childDiv">
        <CategoryBar />
      </div>
      <div className="childDiv" style={{ width:'100%'}}>
        <MainFeed />
      </div>
    </div>
  );
}

export default Opp;
