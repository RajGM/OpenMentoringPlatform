import { useState, useContext, useEffect, use } from "react";
import { UserContext } from "@lib/context";
import toast from "react-hot-toast";
import { firestore } from "@lib/firebase";
import { Formik, Form, Field } from "formik";

const UniversityEmailChecker = () => {
  const [email, setEmail] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(true); // Enable checkEmail by default
  const { user } = useContext(UserContext);
  const [sendToFirebase, setSendToFirebase] = useState<boolean>(false);
  const [listMentor, setListMentor] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingLink, setMeetingLink] = useState<string>("");
  const [isMentor, setIsMentor] = useState<boolean>(false); // State to check if the user is a mentor

  console.log("user", user);

  const fetchMentorStatus = async () => {
    try {
      const userDoc = await firestore.collection("users").doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.mentor === true) {
          setIsMentor(true);
        }
      }
    } catch (error) {
      console.error("Error fetching mentor status:", error);
    }
  };

  const fetchMentorData = async () => {
    try {
      const userID = user?.uid; // Replace with how you get the user's ID

      // Create a Firestore document reference
      const mentorRef = firestore.collection("users").doc(userID);

      // Get the document data
      const mentorData = await mentorRef.get();

      if (mentorData.exists) {
        const mentorData = mentorData.data();
        setMeetingLink(mentorData.meetingLink);
        console.log("mentorData", mentorData);
      }
    } catch (error) {
      // Handle Firestore error
      console.error("Error fetching mentor data from Firestore:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email);

      fetchMentorStatus();
    }

    if (isMentor) {
      fetchMentorData();
    }
  }, [isMentor, user,meetingLink]);

  async function saveMeetingLinkToFirebase() {
    try {
      await firestore.collection("users").doc(user.uid).update({
        meetingLink: meetingLink, // Use the correct variable name with capital 'L'
      });

      // Optionally, show a success message or perform other actions
      toast.success("Meeting link saved successfully!");
    } catch (error) {
      // Handle Firestore update error
      console.error("Error updating meeting link in Firestore:", error);
      // Optionally, show an error message or perform error handling
      toast.error("Failed to save meeting link.");
    }
  }

  const checkEmail = async () => {
    toast.loading("Verifying University email...");

    if (listMentor) {
      // Check if Meeting link is filled when listMentor is checked
      if (!meetingLink) {
        setError("Meeting Link is mandatory when adding to Mentor Board.");
        return;
      }
    }

    try {
      // Get the user's authentication token from the user object
      const authToken = user?.accessToken; // Replace 'token' with the actual key in your user object

      // Set up the headers with the authorization token
      const headers = new Headers({
        authorization: `${authToken}`,
        "Content-Type": "application/json",
      });

      // Create the request body
      const requestBody = JSON.stringify({
        email: email,
      });

      // Make an HTTP POST request to your backend /profile endpoint with headers
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      if (response.status === 200) {
        console.log("Email verified successfully and added to mentors list!");
        toast.dismiss();
        toast.success("Email verified successfully and added to mentors list!");
        setResult("Email verified successfully and added to mentors list!");
        setSendToFirebase(true); // You may still set this flag if needed for other purposes
      } else {
        toast.dismiss();
        toast.error(
          "Email does not belong to the university domain, email us from your university email"
        );
        setSendToFirebase(false); // Set this flag as needed
        setResult(
          "Email does not belong to the university domain, email us from your university email"
        );
      }
    } catch (error) {
      // Handle any errors that occur during the HTTP request
      console.error("Error sending data to the backend:", error);
      // Handle the error and set appropriate states or show a toast message
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">University Email Checker</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Email:
          </label>
          <input
            type="email"
            value={email}
            disabled={true}
            className="input input-bordered w-full"
          />
        </div>

        {isMentor ? (
          <p className="text-sm text-gray-600 mb-4">
            Email verification successful and added to mentors list.
          </p>
        ) : (
          <button
            onClick={checkEmail}
            disabled={!isFormValid}
            className="btn btn-primary w-full mb-4"
          >
            Check Email
          </button>
        )}

        {(sendToFirebase || isMentor) && (
          <div>
            {/* Conditionally render the meetingLink field and save button */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Meeting Link:
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <button
              onClick={saveMeetingLinkToFirebase}
              className="btn btn-primary w-full"
            >
              Save to Firebase
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded text-red-600">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityEmailChecker;

/*
 try {
      // Add your Firestore logic here to save the form fields
      const userID = user.uid; // Replace with how you get the user's ID

      // Create a Firestore document reference
      const mentorRef = firestore.collection("mentors").doc(userID);

      // Set the form fields to Firestore
      await mentorRef.set(
        {
          name: values.name,
          university: values.university,
          degreeCourse: values.degreeCourse,
          universityCountry: values.universityCountry,
          homeCountry: values.homeCountry,
          meetingLink: values.meetingLink,
          isVisible: values.isVisible,
        },
        { merge: true } // Use merge: true to update the document if it exists
      );

      // Handle success or show a toast message
      toast.success("Mentor information saved successfully!");
    } catch (error) {
      // Handle Firestore error
      console.error("Error saving mentor information to Firestore:", error);
      toast.error("Failed to save mentor information.");
    }
*/
