"use client";
import { firestore, getDoc, doc, db, serverTimestamp } from "@lib/firebase";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@lib/context";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
  const { user, username } = useContext(UserContext);
  const [chatdataId, setChatDataId] = useState("");
  console.log("owner user from ChAT PAGE:", user, username);

  const [searchedUser, setSearchedUser] = useState({});

  useEffect(() => {
    queryTest("rajgm");
  }, [chatdataId]);

  async function queryTest(searchValue) {
    //if all then query all users in the userbase

    let query = firestore
      .collection("users")
      .where("username", "==", searchValue);
    const queryData = (await query.get()).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("queryData:", typeof queryData);
    console.log("queryData Array[0]:", queryData[0]);

    setOppData(queryData);
    setSearchedUser[queryData[0]];
    console.log("queryData UID:", queryData[0].id);
  }

  const handleSelect = async (clickedData) => {
    //handle select

    const combinedId =
      clickedData.id > user.uid
        ? clickedData.id + user.uid
        : user.uid + clickedData.id;

    console.log("combinedId:", combinedId);

    try {
      console.log("combinedId inside TRY:", combinedId);
      const res = await firestore.collection("chats").doc(combinedId).get();

      // console.log("res:", res.exists)
      // console.log("res:", res)

      if (!res.exists) {
        fetch("/api/createChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: user ? user.accessToken : undefined,
          },
          body: JSON.stringify({
            user: user,
            username: username,
            combinedId: combinedId,
            user2: clickedData.id,
          }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("response ok");
            } else {
              console.log("response not ok");
            }
          })
          .catch((error) => {
            console.log("error in fetch:");
          });
      } else {
        console.log("chat exists");
      }

      setChatDataId(combinedId);
    } catch (err) {
      console.log("error in creating chat:", err);
    }
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
                        onClick={() => handleSelect(item)}
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
                  : "Not found"}
              </div>
            </>
          </div>
        </div>
        {user && chatdataId && (
          <ChatWindow
            dataId={chatdataId ? chatdataId : null}
            currentUser={user}
          />
        )}

        {!chatdataId && <ChatWindowEmpty />}
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

const ChatWindow = ({ dataId, currentUser }) => {
  const dummy = useRef();
  const user = currentUser.uid;
  const [inputText, setInputText] = useState(""); // State to store input text
  const [dataArr, setDataArr] = useState([]); // State to store chat messages

  const messagesRef = firestore
    .collection("chats")
    .doc(dataId)
    .collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const fetchMsgs = async () => {
    const dataArr = await messagesRef.get();
    const messagesData = dataArr.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDataArr(messagesData);
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return; // Prevent adding empty messages
    console.log("Form submitted!");

    await messagesRef.add({
      text: inputText,
      createdAt: serverTimestamp(),
      user: user,
    });

    setInputText(""); // Clear the input field
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputText.trim() !== "") {
      // Trigger the onSubmit function when Enter key is pressed
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (messages) {
      const messagesData = messages.map((doc) => ({
        id: doc.id,
        ...doc,
      }));
      setDataArr(messagesData);
    }
  }, [messages]);

  useEffect(() => {
    if (dataId) {
      fetchMsgs();
    }
  }, [dataId]);

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
            key={item.id}
            className={item.user !== user ? "chat chat-start" : "chat chat-end"}
          >
            <div className="chat-bubble">{item.text}</div>
          </div>
        ))}

        <span ref={dummy}></span>
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
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
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

const ChatWindowEmpty = () => {
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
      <div style={{ height: "90%", width: "100%" }}></div>

      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
      </div>
    </div>
  );
};
