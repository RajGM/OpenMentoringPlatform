import Link from 'next/link';

interface Post {
  content: string;
  username: string;
  slug: string;
  title: string;
  heartCount?: number;
  published?: boolean;
}

interface PostFeedProps {
  posts: Post[];
  admin?: boolean;
}

export default function PostFeed({ posts, admin }: PostFeedProps) {
  return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

interface PostItemProps {
  post: Post;
  admin?: boolean;
}

function PostItem({ post, admin = false }: PostItemProps) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <strong>By @{post.username}</strong>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/blog/${post.slug}`}>
            <button className="btn-blue">Edit</button>
          </Link>

          {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}
    </div>
  );
}
