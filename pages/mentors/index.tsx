"use client";
import { auth, firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed";

export default function Mentors() {
  const [oppData, setOppData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState(false);

  useEffect(() => {
    queryTest("Hackathon", "all");
  }, []);

  async function queryTest(category:any, searchValue:any) {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          className="navbar text-primary-content"
          style={{
            marginTop: "10px",
            border: "1px solid black",
            boxShadow: "5px 5px",
            width: "95%",
          }}
        >
          <div className="flex-none gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search by organization or person"
                className="input input-bordered w-32 md:w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ minWidth: "320px" }}
              />
            </div>
            <div style={{display:'flex',flexDirection:'row', gap:'10px', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
              <div>University</div>
              <div>
                <input
                  type="checkbox"
                  className="toggle toggle-info"
                  onChange={(e) => {
                    setFilter();
                  }}
                />
              </div>
              <div>Mentor</div>
            </div>
            <div>
              <button
                type="submit"
                className="btn"
                onClick={() => {
                  queryTest("Hackathon", searchValue);
                }}
              >
                Search
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
