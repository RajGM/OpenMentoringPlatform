import PostFeed from "@components/PostFeed";
import Loader from "@components/Loader";
import { firestore, fromMillis, postToJSON } from "@lib/firebase";

import { useState, useEffect } from "react";

import { Empty } from "@components/Empty";
// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context: any) {
  const tagTest = "VISA";

  const postsQuery = firestore
    .collection("posts")
    .where("published", "==", true)
    .where("tag", "==", tagTest)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props: any) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  const [tag, setTag] = useState("VISA");
  const tagList = ["VISA", "SOP", "Blog", "Essay"];
  const [lastCursor, setLastCursor] = useState(null); // Initialize lastCursor state

  // Get next page in pagination query
  async function fetchPosts() {
    setLoading(true);
    setPosts([]); // Clear the existing posts
    setPostsEnd(false); // Reset postsEnd flag
    setLastCursor(null); // Reset the cursor to null

    const postsQuery = firestore
      .collection("posts")
      .where("published", "==", true)
      .where("tag", "==", tag)
      .orderBy("createdAt", "desc")
      .limit(LIMIT);

    const newPosts = (await postsQuery.get()).docs.map(postToJSON);

    setPosts(newPosts);
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }

    // Update the lastCursor with the last post's createdAt timestamp
    if (newPosts.length > 0) {
      const lastPost = newPosts[newPosts.length - 1];
      setLastCursor(lastPost.createdAt);
    }
  }

  // Fetch posts when the tag changes
  useEffect(() => {
    fetchPosts();
  }, [tag]); // Fetch posts when the tag changes

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .where("tag", "==", tag)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  function selectTag(tag: string) {
    setTag(tag);
  }

  return (
    <main className="mt-4 flex flex-col space-y-4 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Tags</h1>
        {tagList.map((tag) => (
          <div className="group relative inline-block text-sm font-medium text-red-600 focus:outline-none focus:ring active:text-red-500">
            <span className="absolute inset-0 border border-current"></span>
            <span className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
              <button key={tag} onClick={() => selectTag(tag)}>
                {tag}
              </button>
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center space-y-4 w-full sm:w-3/4 mx-auto">
        <PostFeed posts={posts} />
      </div>
      <div className="flex flex-col items-center space-y-4">
        {!loading && !postsEnd && (
          <button
            className="group relative inline-block focus:outline-none focus:ring"
            onClick={getMorePosts}
          >
            <span className="absolute inset-0 translate-x-0 translate-y-0 bg-yellow-300 transition-transform group-hover:translate-y-1.5 group-hover:translate-x-1.5"></span>
            <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest">
              Load more
            </span>
          </button>
        )}
        {posts.length === 0 && !loading && <Empty />}
        <Loader show={loading} />
      </div>
    </main>
  );
}
