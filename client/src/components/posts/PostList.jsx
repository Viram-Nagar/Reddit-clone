import PostCard from "./PostCard";
import { PostSkeleton } from "../ui/SkeletonLoader";

const PostList = ({ posts, isLoading, showCommunity = true }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="font-semibold text-gray-700 text-lg">No posts yet</h3>
        <p className="text-gray-400 text-sm mt-1">
          Be the first to share something!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} showCommunity={showCommunity} />
      ))}
    </div>
  );
};

export default PostList;
