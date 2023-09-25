"use client";
import { firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed";

export default function Mentors() {
  const [oppData, setOppData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    queryTest("");
  }, []);

  async function queryTest(searchValue: any) {

    let query = null;
    if (searchValue == "") {
      query = firestore.collection("users").where("mentor", "==", true);
    } else {
      query = firestore
        .collection("users")
        .where("mentor", "==", true)
        .orderBy("displayName")
        .startAt(searchValue)
        .endAt("\uf8ff");
    }

    setLoading(true);
    const queryData = (await query.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOppData(queryData);
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="flex justify-center items-center bg-gray-100">
          <div className="navbar text-primary-content border border-black shadow-lg p-4 rounded-md w-full max-w-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <input
                type="text"
                placeholder="Search by organization or person"
                className="input input-bordered w-full md:w-auto"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary mt-2 md:mt-0"
                onClick={() => {
                  queryTest(searchValue);
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <MentorFeed oppData={oppData} />
        </div>
      </div>
    </>
  );
}
