import Link from "next/link";
import { PostFeedProps, PostItemProps } from "@lib/types";

export default function PostFeed({ posts, admin }: PostFeedProps) {
  return posts
    ? posts.map((post, index) => (
        <PostItem post={post} key={index} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }: PostItemProps) {
  
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <article
      className="w-full max-w-screen-sm mx-auto flex bg-white transition hover:shadow-xl"
      style={{ backgroundColor: "#eef0f1", margin:'10px' }}
    >
      <div className="rotate-180 p-2 [writing-mode:_vertical-lr]">
        <time
          dateTime="2022-10-10"
          className="flex items-center justify-between gap-4 text-xs font-bold uppercase text-gray-900"
        >
          <span>By</span>
          <span className="w-px flex-1 bg-gray-900/10"></span>
          <span>{post.username}</span>
        </time>
      </div>

      <div className="hidden sm:block sm:basis-56">
        <img
          alt="Guitar"
          src="https://images.unsplash.com/photo-1609557927087-f9cf8e88de18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
          className="aspect-square h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between w-full overflow-hidden">
        <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
          <a href="#">
            <h3 className="text-lg sm:text-xl font-bold uppercase text-gray-900">
              {post.title}
            </h3>
          </a>

          <p className="mt-2 line-clamp-3 text-sm sm:text-base text-gray-700">
            {post.content}
          </p>
        </div>

        <div className="sm:flex sm:items-end sm:justify-end">
          <Link
            href={`/${post.username}/${post.slug}`}
            className="block bg-yellow-300 px-4 py-2 sm:px-5 sm:py-3 text-center text-xs sm:text-sm font-bold uppercase text-gray-900 transition hover:bg-yellow-400"
          >
            <h2>Read More</h2>
          </Link>
        </div>

        {admin && (
          <>
            <Link href={`/blog/${post.slug}`}>
              <button className="btn-blue">Edit</button>
            </Link>

            {post.published ? (
              <p className="text-success">Live</p>
            ) : (
              <p className="text-danger">Unpublished</p>
            )}
          </>
        )}
      </div>
    </article>
  );
}
