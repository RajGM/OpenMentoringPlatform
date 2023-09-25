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
  const [userID, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any>(null);
  const [post, setPost] = useState<any>(null);

  async function setUserId() {
    const user = await getUserWithUsername(username as string);
    setUser(user);
  }

  async function getSessions(userId: string) {
    const sessionsQuery = firestore
      .collection("users")
      .doc(userId)
      .collection("sessions");

    const sessions = (await sessionsQuery.get()).docs.map((doc) => doc.data());
    setSessions(sessions);
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
      getSessions(userID.id);
    }else{
      //console.log("No USER DI")
    }

    if (username) {
      getPosts(username as string);
    }
  }, [username, userID]);

  return (
    <div className="bg-yellow-100 p-4 min-h-screen">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Sessions */}
        <div className="flex-1 md:w-1/4 p-4">
          <h2 className="text-lg font-semibold mb-4">Sessions</h2>
          <ul className="space-y-2">
            {sessions &&
              sessions.map((session:any) => (
                <li key={session.id}>
                  <div className="p-2 bg-white rounded shadow">
                    <SessionDiv session={session} mentorData={userID} />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {/* Posts */}
        <div className="flex-1 md:w-1/2 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Posts</h2>
          <div className="w-full">
            <PostFeed posts={post?post:[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

function SessionDiv({ session: session, mentorData }: any) {
  return (
    <div className="group relative block h-64 hover:shadow-lg transition-transform duration-300 ease-in-out transform hover:-translate-y-1">
      <span className="absolute inset-0 border-2 border-dashed border-black"></span>

      <div className="relative flex h-full items-end border-2 border-black bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className="p-4 !pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 sm:h-12 sm:w-12 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {/* SVG path remains unchanged */}
          </svg>

          <h2 className="mt-4 text-xl font-medium sm:text-2xl">
            {session.title}
          </h2>
        </div>

        <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <h3 className="mt-4 text-xl font-medium sm:text-2xl">
            {session.duration} mins
          </h3>

          <div className="mt-8">
            <SessionModal session={session} mentorData={mentorData}  />
          </div>
        </div>
      </div>
    </div>
  );
}
