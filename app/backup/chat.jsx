"use client";
import { firestore } from "@lib/firebase";
import { useEffect, useState } from "react";
import MentorFeed from "@components/MentorFeed/MentorFeed";
import Image from "next/image";

const data = [
  {
    id: 1,
    message: "Hart Hagerty from United States",
  },
  {
    id: 2,
    message: "THis is left message",
  },
];

export default function Chat() {
  const [oppData, setOppData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState(false);

  const [user, setUser] = useState(null);


  useEffect(() => {
    queryTest("rajgm");
  }, []);

  async function queryTest(searchValue) {

    //if all then query all users in the userbase

    let query = firestore.collection('users').where('username', '==', searchValue);
     const queryData = (await query.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("queryData:", queryData);
    setOppData(queryData);
    setUser[queryData[0]];
    console.log("user:", user)
    
  }

  function setFilter() {
    console.log("filterValue:", filterValue);
    setFilterValue(!filterValue);
  }

  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const currentUser={id:"123"};
    console.log("user:", user)

    const combinedId =
      currentUser.id > user.id
        ? currentUser.id + user.id
        : user.id + currentUser.id;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.id), {
          [combinedId + ".userInfo"]: {
            uid: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.id), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.id,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
  };

  return (
    <>
      <div
        className="join"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "95%",
          minHeight: "90vh",
          justifyContent: "space-around",
          gap: "10px",
          margin: "10px",
          boxShadow: "5px 5px",
        }}
      >
        <div
          className="join join-vertical"
          style={{
            width: "18%",
            boxShadow: "5px 5px",
            border: "1px solid black",
          }}
        >
          <div>
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
                        placeholder="Search by username"
                        className="input input-bordered w-32 md:w-full"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ width: "150px" }}
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="btn"
                        onClick={() => {
                          queryTest(searchValue);
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                {oppData.length > 0
                  ? oppData.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                          width: "90%",
                          gap: "10px",
                          border: "1px solid black",
                          boxShadow: "5px 5px",
                        }}
                        onClick={handleSelect}
                      >
                        <div>
                          <Image
                            src={
                              "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
                            }
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="">
                          <div className="font-bold">{item.username}</div>
                          <div className="text-sm opacity-50">
                          {item.displayName}
                          </div>
                        </div>
                      </div>
                    ))
                  : 'Not found'}
              </div>
            </>
          </div>
        </div>

        <ChatWindow dataArr={data} />
      </div>
    </>
  );
}

const ChatInput = () => {
  return (
    <div className="relative">
      <label htmlFor="UserEmail" className="sr-only">
        Chat
      </label>

      <input
        type="text"
        id="UserEmail"
        placeholder="Amazing Chats ..."
        className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm"
      />

      <span className="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path
            fillRule="evenodd"
            d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
};

const ChatWindow = ({ dataArr }) => {
  return (
    <div
      className="overflow-x-auto"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "90%",
        backgroundColor: "lightblue",
        padding: "10px",
      }}
    >
      <div style={{ height: "90%", width: "100%" }}>
        {dataArr.map((item) => (
          <div
            key={item}
            className={item.id === 1 ? "chat chat-start" : "chat chat-end"}
          >
            <div className="chat-bubble">{item.message}</div>
          </div>
        ))}
      </div>

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <input
              type="text"
              id="UserEmail"
              placeholder="Amazing Chats ..."
              className="w-full rounded-md border-gray-200 pe-10 shadow-sm sm:text-sm"
              style={{
                width: "400px",
                minHeight: "40px",
                padding: "10px",
                border: "1px solid black",
                textAlign: "center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
