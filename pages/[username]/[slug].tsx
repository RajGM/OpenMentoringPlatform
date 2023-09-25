// @ts-nocheck
import PostContent from "@components/PostContent";
import Metatags from "@components/Metatags";
import { firestore, getUserWithUsername, postToJSON } from "@lib/firebase";
import { useRouter } from "next/router";

import Link from "next/link";
import {  useEffect, useState } from "react";

interface PostData {
  title: string;
  heartCount?: number;
  // Add other fields as necessary
}

export default function Post() {
  const router = useRouter();
  const { username, slug } = router.query;
  const [post, setPost] = useState<PostData | null>(null);
  const [postRef, setPostRef] = useState<any | null>(null); // Define the shape of postRef if known.

  useEffect(() => {
    if (typeof username === "string" && typeof slug === "string") {
      const postRef = firestore
        .collection("posts")
        .where("username", "==", username)
        .where("published", "==", true)
        .where("slug", "==", slug);

      setPostRef(postRef);

      const getPost = async () => {
        try {
          const querySnapshot = await postRef.get();
          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data() as PostData;
            setPost(postData);
          } else {
            // Handle the case where no matching post was found.
          }
        } catch (error) {
          // Handle any errors that may occur during the query.
          console.error("Error getting post:", error);
        }
      };
      getPost();
    }
  }, [username, slug]);

  if (!username || !slug) {
    // Render loading or error state if username or slug is not available yet.
    return <div>Loading...</div>;
  }

  // Render post content here.
  return (
    <div className="min-h-screen">
      <div>
        {/* Render your post content using the 'post' state */}
        {post ? (
          <div>
            {/* Render your post content using 'post' */}
            <main>
              <Metatags title={post.title} description={post.title} />

              <section>
                <PostContent post={post} />
              </section>

            </main>
          </div>
        ) : (
          <div>No post found.</div>
        )}
      </div>
    </div>
  );
}
