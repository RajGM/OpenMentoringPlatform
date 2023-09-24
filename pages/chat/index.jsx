"use client";
import {
  firestore,
  getDoc,
  doc,
  db,
  serverTimestamp,
  storage,
} from "@lib/firebase";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@lib/context";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Chat() {
  const [oppData, setOppData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const { user, username } = useContext(UserContext);
  const [chatdataId, setChatDataId] = useState("");
  const [searchedUser, setSearchedUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    queryTest("");
  }, [chatdataId, user]);

  async function queryTest(searchValue) {
    //if all then query all users in the userbase
    let query = "";
    if (!user) {
      return;
    }
    console.log(user.uid);

    console.log("searchValue:", searchValue);

    if (searchValue == "" || searchValue.length == 0) {
      query = firestore.collection("userchats").doc(user.uid);

      try {
        const docSnapshot = await query.get();

        if (docSnapshot.exists) {
          const userData = docSnapshot.data();
          console.log("Retrieved User Data:", userData.friends);

          // Create an array of promises for fetching friend data
          const friendDataPromises = userData.friends.map((friend) => {
            const docRef = friend.reference;

            return docRef.get().then((docSnapshot) => {
              if (docSnapshot.exists) {
                const friendData = docSnapshot.data();
                return { chatId: friend.chatId, ...friendData };
              } else {
                return null; // Document doesn't exist
              }
            });
          });

          Promise.all(friendDataPromises)
            .then((friendData) => {
              console.log("Friend data retrieved:", friendData);
              setOppData(friendData);
            })
            .catch((error) => {
              console.error("Error retrieving friend data:", error);
            });
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    } else {
      query = firestore
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
  }

  const handleSelect = async (clickedData) => {
    if (clickedData.chatId) {
      setChatDataId(clickedData.chatId);
      setSelectedUser(clickedData);
    } else {
      const combinedId =
        clickedData.username > username
          ? clickedData.username + username
          : username + clickedData.username;

      try {
        await fetch("/api/createChat", {
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

        console.log("No such document!");
        setChatDataId(combinedId);
        setSelectedUser(clickedData);
      } catch (err) {
        console.log("error in creating chat:", err);
      }

      console.log("create new one");
    }
  };

  return (
    <>
      <div className="flex w-11/12 min-h-[90vh] mx-auto bg-gray-100 rounded-lg shadow-2xl p-8">
        <div className="flex-none w-1/4 bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between bg-green-600 text-white p-4 rounded-lg">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search or start new chat"
                className="input input-bordered w-full text-black"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-light"
              onClick={() => {
                queryTest(searchValue);
              }}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="overflow-y-auto h-[70vh] space-y-4">
            {oppData.length > 0 ? (
              oppData.map((item) => (
                <div
                  key={item.chatId}
                  className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out rounded-lg cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  <Image
                    src={item.photoURL}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-grow ml-4">
                    <div className="font-bold">{item.username}</div>
                    <div className="text-sm text-gray-600">
                      {item.displayName}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600">Not found</div>
            )}
          </div>
        </div>

        <div className="flex-grow bg-gray-200 rounded-lg shadow-md p-6">
          {user && chatdataId ? (
            <ChatWindow
              dataId={chatdataId ? chatdataId : null}
              currentUser={user}
              selectedUser={selectedUser}
            />
          ) : (
            <ChatWindowEmpty />
          )}
        </div>
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

const ChatWindow = ({ dataId, currentUser, selectedUser }) => {
  console.log("CURRENT USER:", currentUser);
  console.log("SELECTED USER:", selectedUser);
  const dummy = useRef();
  const user = currentUser.uid;
  const [inputText, setInputText] = useState(""); // State to store input text
  const [dataArr, setDataArr] = useState([]); // State to store chat messages
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "") return;

    // Check if a file is attached
    if (selectedFile) {
      try {
        const downloadURL = await uploadMediaToStorage(selectedFile);
        await messagesRef.add({
          text: inputText,
          mediaURL: downloadURL, // Save the media URL in the message
          createdAt: serverTimestamp(),
          user: user,
        });
      } catch (error) {
        console.error("Error uploading media message:", error);
      }
    } else {
      await messagesRef.add({
        text: inputText,
        createdAt: serverTimestamp(),
        user: user,
      });
    }

    setInputText("");
  };

  async function uploadMediaToStorage(file) {
    try {
      const storageRef = storage.ref(); // Reference to the root of your storage bucket
      const mediaRef = storageRef.child(`media/${file.name}`); // Specify the path where you want to store the file
      await mediaRef.put(file); // Upload the file to the specified path
      const downloadURL = await mediaRef.getDownloadURL(); // Get the download URL of the uploaded media
      return downloadURL;
    } catch (error) {
      console.error("Error uploading media to storage:", error);
      throw error;
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setSelectedFile(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-4/5 mx-auto flex flex-col space-y-4 h-[80vh]">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="avatar">
            <Image
              src={selectedUser.photoURL}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <span className="font-bold">{selectedUser.username}</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto space-y-4">
        {dataArr.map((item) => (
          <div
            key={item.id}
            className={
              item.user !== user ? "flex justify-start" : "flex justify-end"
            }
          >
            {item.mediaURL ? (
              <img
                src={item.mediaURL}
                alt="Media"
                className="media-preview max-w-xs rounded-lg"
              />
            ) : (
              <div
                className={`chat-bubble p-3 rounded-lg max-w-xs ${
                  item.user !== user
                    ? "bg-gray-200 text-black"
                    : "bg-green-500 text-white"
                }`}
              >
                {item.text}
              </div>
            )}
          </div>
        ))}
        <span ref={dummy}></span>
      </div>

      <div className="flex items-center space-x-4 border-t pt-4">
        <label className="file-input-label">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input hidden"
          />
          <span className="file-input-icon p-2 bg-gray-200 rounded-full cursor-pointer">
            📷
          </span>
        </label>

        <input
          type="text"
          id="UserEmail"
          placeholder="Type a message"
          className="flex-grow p-3 border rounded-lg shadow-sm"
          onKeyDown={handleKeyDown}
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
        />
      </div>
    </div>
  );
};

const ChatWindowEmpty = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-4/5 mx-auto flex flex-col h-[80vh]">
      <div className="flex-grow flex items-center justify-center">
        <span className="text-gray-500 text-center">
          Select a chat to start messaging.
        </span>
      </div>

      <div className="flex items-center space-x-4 border-t pt-4">
        <label className="file-input-label">
          <input type="file" accept="image/*" className="file-input hidden" />
          <span className="file-input-icon p-2 bg-gray-200 rounded-full cursor-pointer">
            📷
          </span>
        </label>

        <input
          type="text"
          placeholder="Type a message"
          className="flex-grow p-3 border rounded-lg shadow-sm"
          disabled
        />
      </div>
    </div>
  );
};
