import { getUserWithUsername, postToJSON, firestore, getUserIdWithUsername } from '@lib/firebase';
import UserProfile from '@components/UserProfile';
import Metatags from '@components/Metatags';
import PostFeed from '@components/PostFeed';
import SessionModal from '@components/SessionModal';
import { GetServerSideProps } from 'next';

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
      .collection('posts')
      .where('published', '==', true)
      .where('username', '==', username)
      .orderBy('createdAt', 'desc')
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);

    // Fetch sessions
    const sessionsQuery = firestore
      .collection('users')
      .doc(userId)
      .collection('sessions');

    sessions = (await sessionsQuery.get()).docs.map((doc) => doc.data());
  }

  return {
    props: { user, posts, sessions }, // will be passed to the page component as props
  };
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, posts, sessions }) => {
  return (
    <main>
      <Metatags title={user.username} description={`${user.username}'s public profile`} />
      <UserProfile user={user} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-around', backgroundColor: 'pink' }}>
        <div style={{ width: '20%', backgroundColor: 'yellow' }}>
          <h2>Sessions</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                <div>
                  {session.title}
                  Book here 
                  {session.duration}
                  <SessionModal gapAmount={session.duration} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ width: '50%', backgroundColor: 'red' }}>
          <PostFeed posts={posts} />
        </div>
        <div style={{ width: '20%', backgroundColor: 'yellow' }}>
          IMPACT MADE HERE
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
