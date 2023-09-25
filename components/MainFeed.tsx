import React, { useEffect, useState } from "react";
import HackathonTile from "./HackathonTile";
import { useAtom } from "jotai";
import { categoriesAtom, filterAtom } from "@lib/atoms";
import { firestore } from "@lib/firebase";
import Loader from "./Loader";
import { CardFieldProps } from "@lib/types";
import { Empty } from "./Empty";

const CardField: React.FC<CardFieldProps> = ({ arrData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {arrData
        ? arrData.map((indiData) => (
            <HackathonTile data={indiData} key={indiData.id} />
          ))
        : null}
    </div>
  );
};

//<HackathonTile data={indiData} key={indiData.id} />

const MainFeed: React.FC = () => {
  const [category] = useAtom(categoriesAtom);
  const [filter] = useAtom(filterAtom);
  const [oppData, setOppData] = useState<any[]>([]); // Replace 'any' with the actual type of the data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queryTest(category, filter);
  }, [filter]);

  async function queryTest(category: string, filter: string) {
    let query;
    if (filter === "all" || filter === "All") {
      query = firestore.collection(
        category.charAt(0).toUpperCase() + category.slice(1)
      );
    } else {
      query = firestore
        .collection(category.charAt(0).toUpperCase() + category.slice(1))
        .where("filters", "==", filter.toLowerCase());
    }
    setLoading(true);
    const queryData = (await query.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOppData(queryData);
    setLoading(false);
  }

  if (loading == true) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        className="min-h-screen"
      >
        <Loader show={true} />
      </div>
    );
  } else {
    if (oppData.length == 0) {
      return (
        <div className="fullHeightMain middle min-h-screen">
          <h1>Sorry, no opportunities found!</h1>
          <h2>Please add some for the community</h2>
          <Empty />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen">
          <CardField arrData={oppData} />
        </div>
      );
    }
  }
};

export default MainFeed;
