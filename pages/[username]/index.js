import { getUserWithUsername, postToJSON, firestore,getUserIdWithUsername } from '@lib/firebase';
import UserProfile from '@components/UserProfile';
import Metatags from '@components/Metatags';
import PostFeed from '@components/PostFeed';
import SessionModal from '@components/SessionModal';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);
  const userId = await getUserIdWithUsername(username);

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

      console.log("userId:", userId)
    sessions = (await sessionsQuery.get()).docs.map((doc) => doc.data());

    console.log("sessions:", sessions);
  } else {
    console.log("no user DOC")
  }

  return {
    props: { user, posts, sessions }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts, sessions }) {
  return (
    <main>
      <Metatags title={user.username} description={`${user.username}'s public profile`} />
      <UserProfile user={user} />
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-around', backgroundColor: 'pink', justifyContent: 'space-around' }}>
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
              // Replace "session.title" with the appropriate field from your session data
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
}
