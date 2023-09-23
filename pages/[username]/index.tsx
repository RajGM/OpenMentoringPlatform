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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query;

  const userDoc = await getUserWithUsername(username as string);
  const userId = await getUserIdWithUsername(username as string);

  // If no user, short circuit to 404 page
  if (!userDoc && !userId) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;
  let sessions = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = firestore
      .collection("posts")
      .where("published", "==", true)
      .where("username", "==", username)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);

    // Fetch sessions
    const sessionsQuery = firestore
      .collection("users")
      .doc(userId)
      .collection("sessions");

    sessions = (await sessionsQuery.get()).docs.map((doc) => doc.data());
  }

  return {
    props: { user, posts, sessions }, // will be passed to the page component as props
  };
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  posts,
  sessions,
}) => {
  return (
    <main>
      <Metatags
        title={user.username}
        description={`${user.username}'s public profile`}
      />
      <UserProfile user={user} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          justifyContent: "space-around",
          backgroundColor: "pink",
        }}
      >
        <div style={{ width: "20%", backgroundColor: "yellow" }}>
          <h2>Sessions</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                <SessionDiv session={session} />
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: "50%", backgroundColor: "red" }}>
          <PostFeed posts={posts} />
        </div>
        <div style={{ width: "20%", backgroundColor: "yellow" }}>
          IMPACT MADE HERE
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;

function SessionDiv({ session: session }: any) {
  console.log(session);
  console.log(session.title);

  return (
    <div className="group relative block h-64 sm:h-80 lg:h-96">
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
