"use client";
import { auth, firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed/MentorFeed";

export default function Mentors() {
  const [oppData, setOppData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState(false);

  async function queryTest(category, searchValue) {
    console.log("Grabbing data from firestore");
    console.log("searchValue:", searchValue);

    let query;
    if (searchValue == "all" || searchValue == "All") {
      query = firestore.collection(
        category.charAt(0).toUpperCase() + category.slice(1)
      );
    } else {
      query = firestore
        .collection(category.charAt(0).toUpperCase() + category.slice(1))
        .where("filters", "==", searchValue.toLowerCase()); //.where('Type', '==', filter.toLowerCase());
    }
    setLoading(true);
    const queryData = (await query.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOppData(queryData);
    console.log("queryData:", queryData);
    setLoading(false);
  }

  function setFilter() {
    console.log("filterValue:", filterValue);
    setFilterValue(!filterValue);
  }

  return (
    <>
      <div style={{display:"flex", flexDirection:'column',  justifyContent:'center', alignItems:'center', gap:'10px'}}>
        <div className="navbar bg-primary text-primary-content">
          <div className="flex-none gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search by mentor or uni"
                className="input input-bordered w-24 md:w-auto"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div>
              University
              <input
                type="checkbox"
                className="toggle toggle-info"
                onChange={(e) => {
                  setFilter();
                }}
              />
              Mentors
            </div>
            <div>
              <button
                type="submit"
                className="btn"
                onClick={() => {
                  queryTest("Hackathon", searchValue);
                }}
              >
                Button
              </button>
            </div>
          </div>
        </div>
        <div>
          <MentorFeed oppData={oppData} />
        </div>
      </div>
    </>
  );
}
