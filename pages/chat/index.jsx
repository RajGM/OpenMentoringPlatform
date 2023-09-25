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
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    queryTest("");
  }, [chatdataId, user]);

  async function queryTest(searchValue) {
    //if all then query all users in the userbase
    let query = "";
    if (!user) {
      return;
    }

    if (searchValue == "" || searchValue.length == 0) {
      query = firestore.collection("userchats").doc(user.uid);

      try {
        const docSnapshot = await query.get();

        if (docSnapshot.exists) {
          const userData = docSnapshot.data();

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
              setOppData(friendData);
            })
            .catch((error) => {
              console.error("Error retrieving friend data:", error);
            });
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

      setOppData(queryData);
      setSearchedUser[queryData[0]];
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
        }).catch((error) => {
          console.error("error in fetch:");
        });

        setChatDataId(combinedId);
        setSelectedUser(clickedData);
      } catch (err) {
        console.error("error in creating chat:", err);
      }
    }

    setShowChatWindow(true);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-11/12 min-h-[90vh] mx-auto bg-gray-100 rounded-lg shadow-2xl p-8">
        <div className="flex-none w-full md:w-1/4 bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between bg-green-600 text-white p-4 rounded-lg">
            <div className="form-control w-full md:w-auto mb-2 md:mb-0">
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
              className="btn btn-light mt-2 md:mt-0"
              onClick={() => {
                queryTest(searchValue);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
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

const ChatWindow = ({ dataId, currentUser, selectedUser }) => {
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
  const query = messagesRef.orderBy("createdAt");
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
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (dataId) {
      fetchMsgs();
    }
  }, [dataId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      try {
        const downloadURL = await uploadMediaToStorage(selectedFile);
        if (downloadURL) {
          await messagesRef.add({
            text: "Image",
            mediaURL: downloadURL,
            createdAt: serverTimestamp(),
            user: user,
          });
          setSelectedFile(null); // Reset the selected file
          setSelectedImage(null);
        } else {
          console.error("Failed to get download URL for the image.");
        }
      } catch (error) {
        console.error("Error uploading media message:", error);
      }
    } else if (inputText.trim() !== "") {
      await messagesRef.add({
        text: inputText,
        createdAt: serverTimestamp(),
        user: user,
      });
      setInputText(""); // Reset the input text
    }
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));

      // Initiate the upload immediately after file is selected
      try {
        const downloadURL = await uploadMediaToStorage(file);
        if (downloadURL) {
          await messagesRef.add({
            text: "Image",
            mediaURL: downloadURL,
            createdAt: serverTimestamp(),
            user: user,
          });
          setSelectedFile(null); // Reset the selected file after upload
          setSelectedImage(null);
        } else {
          console.error("Failed to get download URL for the image.");
        }
      } catch (error) {
        console.error("Error uploading media message:", error);
      }
    }
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

        {selectedImage && (
          <div className="flex justify-end items-center space-x-4 bg-white p-4 rounded-lg shadow-md">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected Media"
                className="media-preview max-w-xs rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="spinner text-white"></div>
              </div>
            </div>
            <span className="text-gray-600">Uploading...</span>
          </div>
        )}

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
