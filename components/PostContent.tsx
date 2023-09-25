import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { PostContentProps } from "@lib/types";

const PostContent: React.FC<PostContentProps> = ({ post }) => {

  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div
      className="flex justify-center items-center"
      style={{ paddingTop: "50px", paddingBottom: "50px" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4">{post?.title}</h1>
        <span className="text-gray-600 text-sm block mb-6">
          Written by{" "}
          <Link
            href={`/${post.username}/`}
            className="text-blue-500 hover:underline"
          >
            @{post.username}
          </Link>{" "}
          on {createdAt.toISOString()}
        </span>
        <div className="prose prose-sm sm:prose">
          <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default PostContent;
