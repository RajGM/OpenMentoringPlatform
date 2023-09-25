import styles from "@styles/Admin.module.css";
import AuthCheck from "@components/AuthCheck";
import PostFeed from "@components/PostFeed";
import { UserContext } from "@lib/context";
import { firestore, auth, serverTimestamp } from "@lib/firebase";

import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  );
}

interface Post {
  title: string;
  slug: string;
  uid: string;
  username: string;
  published: boolean;
  content: string;
  createdAt: typeof serverTimestamp;
  updatedAt: typeof serverTimestamp;
  heartCount: number;
  postRef?: any; // Adjust this type based on the structure of your data
  // Add other post properties as needed
}

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const userRef = firestore
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("posts");
    //const postsRef = userRef.collection('posts');

    const querySnapshot = await userRef.get();

    const postsData = [];

    for (const doc of querySnapshot.docs) {
      const postData = doc.data();
      // Fetch additional data from the "posts" collection
      const postDoc = await firestore
        .collection("posts")
        .doc(postData.postRef.id)
        .get();
      const post = postDoc.data();

      if (post) {
        postsData.push({ ...postData, ...post });
      }
    }

    setPosts(postsData);
  };

  useEffect(() => {
    fetchPosts();
  }, [posts]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Manage Your Posts</h1>
      <PostFeed posts={posts} admin />
    </div>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState<string>("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const refToPostsCollection = firestore.collection("posts"); // Reference to the "posts" collection
    const refToUserPostsCollection = firestore
      .collection("users")
      .doc(uid)
      .collection("posts");

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    // Create a new document in the "posts" collection
    const postDoc = await refToPostsCollection.add(data);

    // Create a reference to the newly created "posts" document inside the user's "posts" subcollection
    const userPostRef = refToUserPostsCollection.doc(postDoc.id);

    await userPostRef.set({ postRef: postDoc });

    toast.success("Post created!");

    //router.reload();
    // Imperative navigation after doc is set
    router.push(`/blog/${data.slug}`);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ margin: "10px" }}
    >
      <form
        onSubmit={createPost}
        className="w-96 space-y-6 p-4 bg-white shadow-lg rounded-lg"
      >
        <label
          htmlFor="title"
          className="block text-lg font-semibold text-gray-700"
        >
          Create Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article"
          className="input input-primary"
        />
        <div className="flex items-center space-x-4">
          <strong>Slug:</strong>
          <p>{slug}</p>
        </div>
        <button type="submit" disabled={!isValid} className="btn btn-primary">
          Create New Post
        </button>
      </form>
    </div>
  );
}
