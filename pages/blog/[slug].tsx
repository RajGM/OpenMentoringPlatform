import styles from "@styles/Admin.module.css";
import AuthCheck from "@components/AuthCheck";
import { firestore, auth, serverTimestamp } from "@lib/firebase";
import ImageUploader from "@components/ImageUploader";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";

interface PostData {
  title: string;
  slug: string;
  username?: string;
  content?: string;
  published?: boolean;
  tag?: string;
  // Add other post properties as needed
}

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const [post, setPost] = useState<{ id: string; data: PostData } | null>(null);

  const router = useRouter();
  const { slug } = router.query;
  const postRef = firestore.collection("posts").where("slug", "==", slug);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postSnapshot = await postRef.get();

        if (!postSnapshot.empty) {
          const postData = postSnapshot.docs[0].data() as PostData;
          setPost({ id: postSnapshot.docs[0].id, data: postData });
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    if (typeof slug === "string") {
      fetchPost();
    }
  }, [slug]);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.data.title}</h1>
            <p>ID: {post.data.slug}</p>

            <PostForm
              defaultValues={post.data}
              preview={preview}
              postId={post.id}
            />
          </section>

          <aside>
            <h3>Tools</h3>

            <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
              <button onClick={() => setPreview(!preview)}>
                {preview ? <EditButton /> : <PreViewButton />}
              </button>

              <>
                <Link href={`/${post.data.username}/${post.data.slug}`}>
                  <button className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-green-500 hover:text-gray-700 focus:relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Live View
                  </button>
                </Link>
              </>

              <DeletePostButton postRef={post.id} />
            </div>
          </aside>
        </>
      )}
    </main>
  );
}

interface PostFormProps {
  defaultValues: PostData;
  preview: boolean;
  postId: string;
}

function PostForm({ defaultValues, preview, postId }: PostFormProps) {
  const postRef = firestore.collection("posts").doc(postId);
  const { register, errors, handleSubmit, formState, reset, watch } =
    useForm<PostData>({ defaultValues, mode: "onChange" });

  const { isValid, isDirty } = formState;

  const tagOptions = ["SOP", "Blog", "Hack", "VISA", "Essay"];

  const updatePost = async ({ content, published, tag }: PostData) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
      tag,
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      {/* ... rest of the form ... */}
      <select
        name="tag"
        {...register("tag", {
          required: { value: true, message: "Tag is required" },
        })}
        className="w-full h-10 px-4 py-2 bg-white border rounded-lg shadow appearance-none focus:outline-none focus:ring focus:border-blue-500"
      >
        <option value="" disabled selected>
          Select a tag
        </option>
        {tagOptions.map((tag, index) => (
          <option key={index} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          name="content"
          {...register("content", {
            maxLength: { value: 20000, message: "Content is too long" },
            minLength: { value: 10, message: "Content is too short" },
            required: { value: true, message: "Content is required" },
          })}
        ></textarea>

        {errors && <p className="text-danger">{errors}</p>}

        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            {...register("published")} // Provide the field name as an argument to register
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

interface DeletePostButtonProps {
  id: string;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ id }) => {
  const router = useRouter();

  const postRef = firestore.collection("posts").doc(id);
  const userPostRef = firestore
    .collection("users")
    .doc(auth.currentUser?.uid)
    .collection("posts")
    .doc(id);

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await postRef.delete();
      await userPostRef.delete();
      console.log("POST DELETED");
      //router.push('/blog');
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button
      className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-red-500 shadow-sm focus:relative"
      onClick={deletePost}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        />
      </svg>
      Delete
    </button>
  );
};

//delete post not working check

function EditButton() {
  return (
    <div className="inline-flex rounded-lg border border-gray-100 p-1">
      <button className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-blue-500 hover:text-gray-700 focus:relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
        Edit
      </button>
    </div>
  );
}

function PreViewButton() {
  return (
    <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
      <button className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-blue-500 hover:text-gray-700 focus:relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        PreView
      </button>
    </div>
  );
}
