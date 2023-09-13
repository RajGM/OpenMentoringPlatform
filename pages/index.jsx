import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import PostFeed from "@components/PostFeed";
import Metatags from "@components/Metatags";
import Loader from "@components/Loader";
import { firestore, fromMillis, postToJSON } from "@lib/firebase";

import { use, useState, useEffect } from "react";

// Max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
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

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);
  const [tag, setTag] = useState("VISA");
  const tagList = ["VISA", "SOP", "Blog", "Essay"];
  const [lastCursor, setLastCursor] = useState(null); // Initialize lastCursor state

  // Get next page in pagination query
  // Fetch posts when the tag changes
  useEffect(() => {
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

  function selectTag(tag) {
    setTag(tag);
    console.log(tag);
  }

  return (
    <main>
      <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <div style={{ width: "80%" }}>
          <PostFeed posts={posts} />
        </div>
        <div style={{ width: "20%" }}>
          {tagList.map((tag) => (
            <button
              key={tag}
              onClick={() => selectTag(tag)}
              style={{
                backgroundColor: tag === tag ? "blue" : "white",
                color: tag === tag ? "white" : "black",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />
    </main>
  );
}
