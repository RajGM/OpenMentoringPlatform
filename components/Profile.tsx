import React, { useState, FormEvent, useContext,useEffect  } from "react";
import { UserContext } from "@lib/context";
import { firestore } from "@lib/firebase";
import { toast } from "react-hot-toast";

import {ProfileState} from "@lib/types";

const Profile: React.FC = () => {
  const { user } = useContext(UserContext);

  const [state, setState] = useState<ProfileState>({
    university: "",
    bio: "",
    major: "",
    country: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const doc = await firestore.collection('users').doc(user.uid).get();
          if (doc.exists) {
            setState(doc.data() as ProfileState);
          }
        } catch (error) {
          toast.error('Error fetching profile data.');
        }
      };

      fetchData();
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not authenticated!");
      return;
    }

    const notify = toast.loading("Saving profile...");

    try {
      await firestore
        .collection("users")
        .doc(user.uid)
        .set(state, { merge: true });
      toast.success("Profile saved successfully!", { id: notify });
    } catch (error) {
      toast.error("Error saving profile.", { id: notify });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 bg-white shadow-md rounded-lg w-full md:w-3/4 lg:w-1/2 mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            University:
          </label>
          <input
            type="text"
            name="university"
            value={state.university}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your university"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Short Bio:
          </label>
          <textarea
            name="bio"
            value={state.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="A short bio about yourself"
            rows={4}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Major Studying:
          </label>
          <input
            type="text"
            name="major"
            value={state.major}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Your major"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Country:
          </label>
          <input
            type="text"
            name="country"
            value={state.country}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Country of residence"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Contact Email:
          </label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            placeholder="Your contact email"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
