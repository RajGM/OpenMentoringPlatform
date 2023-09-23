import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

interface Post {
  title?: string;
  content?: string;
  username?: string;
  createdAt: number | { toDate: () => Date };
}

interface PostContentProps {
  post: Post;
}

const PostContent: React.FC<PostContentProps> = ({ post }) => {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          @{post.username}
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMarkdown>{post?.content||''}</ReactMarkdown>
    </div>
  );
}

export default PostContent;
