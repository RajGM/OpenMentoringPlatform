import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { PostContentProps } from "@lib/types";

const PostContent: React.FC<PostContentProps> = ({ post }) => {

  console.log("post", post);

  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className="container mx-auto mt-8" style={{marginTop:'100px'}}>
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
      <div className="flex items-center space-x-2 text-gray-600">
        <span>Written by</span>
        <Link href={`/${post.username}`} className="text-blue-500 hover:underline">
          @{post.username}
        </Link>
        <span className="mx-1">&#8226;</span>
        <span>{createdAt.toDateString()}</span>
      </div>
      <div className="mt-4 prose">
        {post.content}
      </div>
      <div className="mt-4 flex items-center space-x-2 text-gray-500">
        <span>{post.heartCount} likes</span>
        <span className="mx-1">&#8226;</span>
        <span>Tagged in: {post.tag}</span>
      </div>
    </div>
  </div>
  );
};

export default PostContent;
