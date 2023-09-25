import {
  getUserWithUsername,
  postToJSON,
  firestore,
  getUserIdWithUsername,
} from "@lib/firebase";
import UserProfile from "@components/UserProfile";
import Metatags from "@components/Metatags";
import PostFeed from "@components/PostFeed";
import SessionModal from "@components/SessionModal";
import { GetServerSideProps } from "next";
import { query } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

type Session = {
  id: string;
  title: string;
  duration: number;
  // Add other fields as necessary
};

type Post = {
  // Define the shape of your post here
  // For example:
  title: string;
  content: string;
  createdAt: Date;
  // Add other fields as necessary
};

type User = {
  username: string;
  // Add other fields as necessary
};
interface UserProfilePageProps {
  user: User;
  posts: Post[];
  sessions: Session[];
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({}) => {
  const router = useRouter();
  const { username } = router.query;
  const [userID, setUser] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [post, setPost] = useState(null);

  async function setUserId() {
    const user = await getUserWithUsername(username as string);
    setUser(user);
  }

  async function getSessions(userId: string) {
    console.log("userId insideSession: ", userId);

     
    const sessionsQuery = firestore
      .collection("users")
      .doc(userID.id)
      .collection("sessions");

    const sessions = (await sessionsQuery.get()).docs.map((doc) => doc.data());
    setSessions(sessions);
    console.log("sessions: ", sessions);
  }

  async function getPosts(username: string) {
    const postsQuery = firestore
      .collection("posts")
      .where("published", "==", true)
      .where("username", "==", username)
      .orderBy("createdAt", "desc")
      .limit(5);
    const posts = (await postsQuery.get()).docs.map(postToJSON);
    setPost(posts);
  }

  useEffect(() => {
    if (username && !userID) {
      setUserId();
    }
  
    if (userID) {
      console.log("userID inside: ", userID.id);
      getSessions(userID.id);
    }

    if (username) {
      getPosts(username as string);
    }
  }, [username, userID]);

  return (
    <div className="bg-yellow-100 p-4">
      <div className="flex flex-row space-x-4">
        <div className="w-1/4">
          <h2 className="text-lg font-semibold mb-4">Sessions</h2>
          <ul>
            {sessions &&
              sessions.map((session) => (
                <li key={session.id} className="mb-2">
                  <SessionDiv session={session} />
                </li>
              ))}
          </ul>
        </div>
        <div className="w-1/2 bg-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Posts</h2>
          <div className="w-full">
            <PostFeed posts={post} />
          </div>
        </div>
        <div className="w-1/2 bg-red-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Impact Made</h2>
          <div className="w-full">
            Feedback HERE
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default UserProfilePage;

function SessionDiv({ session: session }: any) {
  return (
    <div className="group relative block h-64">
      <span className="absolute inset-0 border-2 border-dashed border-black"></span>

      <div className="relative flex h-full transform items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 className="mt-4 text-xl font-medium sm:text-2xl">
            {session.title}
          </h2>
        </div>

        <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <h3 className="mt-4 text-xl font-medium sm:text-2xl">
            {session.duration} mins
          </h3>

          <p className="mt-4 text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate,
            praesentium voluptatem omnis atque culpa repellendus.
          </p>

          <p className="mt-8 font-bold">
            <SessionModal gapAmount={session.duration} />
          </p>
        </div>
      </div>
    </div>
  );
}
