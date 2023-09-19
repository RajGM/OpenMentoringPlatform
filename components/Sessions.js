import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '@lib/context';
import { firestore } from '@lib/firebase';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [sessionTitle, setSessionTitle] = useState('');
    const [sessionDuration, setSessionDuration] = useState('');
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        // Check if both user and username are present before fetching sessions
        if (user && username) {
            // Assuming you have a Firebase collection named 'sessions' under each user
            const sessionsRef = firestore.collection('users').doc(user.uid).collection('sessions');
    
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
                duration: sessionDuration
            };
    
            // Assuming you have a Firebase collection named 'users'
            // and each user document has a 'sessions' subcollection
            const userDocRef = firestore.collection('users').doc(user.uid);
            const sessionsRef = userDocRef.collection('sessions');
    
            try {
                // Add the new session to the user's sessions subcollection
                await sessionsRef.add({
                    title: newSession.title,
                    duration: newSession.duration,
                });
    
                // Clear the input fields
                setSessionTitle('');
                setSessionDuration('');
            } catch (error) {
                console.error('Error creating session:', error);
            }
        }
    };
    
    const handleDeleteSession = async (index, sessionId) => {
        // Assuming you have a Firebase collection named 'sessions'
        const sessionsRef = firestore.collection('users').doc(user.uid).collection('sessions');

        try {
            // Delete the session from Firestore using its ID
            await sessionsRef.doc(sessionId).delete();

            // Remove the session from the local state
            const updatedSessions = sessions.filter((_, i) => i !== index);
            setSessions(updatedSessions);
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    return (
        <div>
            <h2>Create Session</h2>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={sessionTitle}
                    onChange={handleTitleChange}
                />
            </div>
            <div>
                <label>Duration (minutes):</label>
                <input
                    type="number"
                    value={sessionDuration}
                    onChange={handleDurationChange}
                />
            </div>
            <button onClick={handleCreateSession}>Create Session</button>

            <h2>Sessions List</h2>
            <ul>
                {sessions.map((session, index) => (
                    console.log("session:", session),
                    <li key={index}>
                        {session.title} - {session.duration} minutes
                        <button onClick={() => handleDeleteSession(index,session.id)}>
                            Delete
                        </button>
                    </li>
                )
                )}
            </ul>
        </div>
    );
};

export default Sessions;
