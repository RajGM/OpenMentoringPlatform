import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "@lib/context";
import { firestore } from "@lib/firebase";

import { Session } from "@lib/types";
import { toast } from "react-hot-toast";

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionTitle, setSessionTitle] = useState<string>("");
  const [sessionDuration, setSessionDuration] = useState<string>("");
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    // Check if both user and username are present before fetching sessions
    if (user && username) {
      // Assuming you have a Firebase collection named 'sessions' under each user
      const sessionsRef = firestore
        .collection("users")
        .doc(user.uid)
        .collection("sessions");

      // Use Firestore to fetch sessions for the current user
      sessionsRef.onSnapshot((snapshot) => {
        const newSessions = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          newSessions.push({
            id: doc.id,
            title: data.title,
            duration: data.duration,
          });
        });
        setSessions(newSessions);
      });
    }
  }, [user, username]);

  async function fetchSession(sessionsRef) {
    const docSnapshot = await sessionsRef.doc(user.uid).get();
    const data = docSnapshot.data();
    console.log(data); // Log the data to see the result
  }

  const handleTitleChange = (e) => {
    setSessionTitle(e.target.value);
  };

  const handleDurationChange = (e) => {
    setSessionDuration(e.target.value);
  };

  const handleCreateSession = async () => {
    if (sessionTitle && sessionDuration) {
      const newSession = {
        title: sessionTitle,
        duration: sessionDuration,
      };

      // Assuming you have a Firebase collection named 'users'
      // and each user document has a 'sessions' subcollection
      const userDocRef = firestore.collection("users").doc(user?.uid);
      const sessionsRef = userDocRef.collection("sessions");

      // Start the loading toast
      const toastId = toast.loading('Creating session...');

      try {
        // Add the new session to the user's sessions subcollection
        await sessionsRef.add({
          title: newSession.title,
          duration: newSession.duration,
        });

        // Clear the input fields
        setSessionTitle("");
        setSessionDuration("");

        // Update the toast to show success
        toast.success('Session created successfully!', { id: toastId });
      } catch (error) {
        console.error("Error creating session:", error);

        // Update the toast to show error
        toast.error('Failed to create session.', { id: toastId });
      }
    }
  };

  const handleDeleteSession = async (index, sessionId) => {
    // Assuming you have a Firebase collection named 'sessions'
    const sessionsRef = firestore
      .collection("users")
      .doc(user.uid)
      .collection("sessions");

    // Start the loading toast
    const toastId = toast.loading("Deleting session...");

    try {
      // Delete the session from Firestore using its ID
      await sessionsRef.doc(sessionId).delete();

      // Remove the session from the local state
      const updatedSessions = sessions.filter((_, i) => i !== index);

      // Update the toast to show success
      toast.success("Session deleted successfully!", { id: toastId });
      setSessions(updatedSessions);
    } catch (error) {
      console.error("Error deleting session:", error);

      // Update the toast to show error
      toast.error("Failed to delete session.", { id: toastId });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Create Session</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title:</label>
          <input
            type="text"
            value={sessionTitle}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Duration (minutes):
          </label>
          <input
            type="number"
            value={sessionDuration}
            onChange={handleDurationChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleCreateSession}
          className="btn btn-primary w-full"
        >
          Create Session
        </button>
      </div>

      <div className="w-full max-w-xl bg-white p-6 mt-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Sessions List</h2>
        <ul className="space-y-4">
          {sessions.map((session, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-2"
            >
              <span>
                {session.title} - {session.duration} minutes
              </span>
              <button
                onClick={() => handleDeleteSession(index, session.id)}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sessions;
