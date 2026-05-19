import { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFeedStore from "../store/feedStore";
import useAuthStore from "../store/authStore";
import usePostStore from "../store/postStore";
import PostList from "../components/posts/PostList";
import SortBar from "../components/posts/SortBar";
import FeedSelector from "../components/feed/FeedSelector";
import TrendingBar from "../components/feed/TrendingBar";
import BackToTop from "../components/ui/BackToTop";
import EmptyState from "../components/ui/EmptyState";
import PageWrapper, { TwoColumnLayout } from "../components/layout/PageWrapper";
import { PostSkeleton } from "../components/ui/SkeletonLoader";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

// ─── Loading spinner for load more ────────────────────
const LoadingMore = () => (
  <div className="flex justify-center py-6">
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <svg
        className="animate-spin h-5 w-5 text-reddit-orange"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      Loading more posts...
    </div>
  </div>
);

// ─── End of feed indicator ─────────────────────────────
const EndOfFeed = ({ count }) => (
  <div className="text-center py-8 border-t border-gray-200">
    <p className="text-gray-400 text-sm">You've seen all {count} posts 🎉</p>
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="text-reddit-blue text-xs hover:underline mt-1"
    >
      Back to top ↑
    </button>
  </div>
);

// ─── Following Feed Empty State ───────────────────────
const FollowingEmpty = () => {
  const navigate = useNavigate();
  return (
    <div className="card">
      <EmptyState
        emoji="🌱"
        title="Your following feed is empty"
        subtitle="Join some communities to see their posts here!"
        action={() => navigate("/communities")}
        actionLabel="Explore Communities"
      />
    </div>
  );
};

// ─── Create Post Box ───────────────────────────────────
const CreatePostBox = ({ user }) => (
  <div className="card p-2 flex items-center gap-2 mb-4">
    <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
      {user ? (
        <span className="text-gray-600 font-bold text-sm">
          {user.username[0].toUpperCase()}
        </span>
      ) : (
        <span className="text-2xl">👤</span>
      )}
    </div>
    <Link to={user ? "/communities" : "/register"} className="flex-1">
      <input
        type="text"
        placeholder="Create Post"
        readOnly
        className="input cursor-pointer bg-gray-50 hover:border-reddit-blue hover:bg-white transition-all"
      />
    </Link>
    <Link to={user ? "/communities" : "/register"}>
      <button className="btn-ghost p-2 rounded" title="Image post">
        🖼
      </button>
    </Link>
    <Link to={user ? "/communities" : "/register"}>
      <button className="btn-ghost p-2 rounded" title="Link post">
        🔗
      </button>
    </Link>
  </div>
);

// ─── Home Sidebar ──────────────────────────────────────
const HomeSidebar = ({ user }) => (
  <>
    {/* Home info card */}
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="h-10 bg-gradient-to-r from-reddit-orange to-orange-400" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 bg-reddit-orange rounded-full flex items-center justify-center -mt-7 border-2 border-white shadow">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-gray-900">Home</span>
        </div>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Your personal Reddit frontpage. Come here to check in with your
          favourite communities.
        </p>
        {user ? (
          <div className="space-y-2">
            <Link to="/create-community">
              <button className="btn-primary w-full">Create Community</button>
            </Link>
            <Link to="/communities">
              <button className="btn-secondary w-full">Explore</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            <Link to="/register">
              <button className="btn-primary w-full">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="btn-secondary w-full">Log In</button>
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* Trending communities */}
    <TrendingBar />

    {/* Footer */}
    <div className="text-xs text-gray-400 px-1 space-y-1 leading-relaxed">
      <p className="font-medium text-gray-500">Reddit Clone</p>
      <p>Built with React • Node.js • PostgreSQL</p>
      <p className="mt-2">
        <Link to="/communities" className="hover:underline text-reddit-blue">
          Communities
        </Link>
        {" · "}
        <Link to="/register" className="hover:underline text-reddit-blue">
          Sign Up
        </Link>
      </p>
    </div>
  </>
);

// ─── Home Page ─────────────────────────────────────────
const Home = () => {
  const {
    posts,
    sort,
    feedType,
    isLoading,
    isLoadingMore,
    hasMore,
    isEmpty,
    total,
    error,
    setSort,
    setFeedType,
    fetchFeed,
    fetchTrending,
    loadMore,
    updatePostVote,
  } = useFeedStore();

  const { user } = useAuthStore();

  // Keep postStore in sync for vote updates from feed
  const { updatePostVote: syncPostStore } = usePostStore();

  // Initial load + refetch on sort/feedType change
  useEffect(() => {
    fetchFeed(sort, feedType);
  }, [sort, feedType]);

  // Load trending once on mount
  useEffect(() => {
    fetchTrending();
  }, []);

  // Infinite scroll sentinel
  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: handleLoadMore,
  });

  const handleSort = (newSort) => {
    setSort(newSort);
  };

  const handleFeedType = (type) => {
    if (type === "following" && !user) return;
    setFeedType(type);
  };

  return (
    <>
      <PageWrapper>
        <TwoColumnLayout
          main={
            <>
              {/* Create post box */}
              <CreatePostBox user={user} />

              {/* Feed type selector */}
              <FeedSelector feedType={feedType} onSelect={handleFeedType} />

              {/* Sort bar — only show on home feed */}
              {feedType === "home" && (
                <SortBar sort={sort} onSort={handleSort} />
              )}

              {/* ── Feed Content ──────────────────── */}
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="card">
                  <EmptyState
                    emoji="⚠️"
                    title="Failed to load feed"
                    subtitle="Something went wrong. Please try again."
                    action={() => fetchFeed(sort, feedType)}
                    actionLabel="Try Again"
                  />
                </div>
              ) : isEmpty ? (
                <FollowingEmpty />
              ) : posts.length === 0 ? (
                <div className="card">
                  <EmptyState
                    type="feed"
                    action={() => handleFeedType("home")}
                    actionLabel="Browse All Posts"
                  />
                </div>
              ) : (
                <>
                  {/* Posts */}
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} showCommunity />
                    ))}
                  </div>

                  {/* Infinite scroll sentinel */}
                  <div ref={sentinelRef} className="h-4" />

                  {/* Loading more indicator */}
                  {isLoadingMore && <LoadingMore />}

                  {/* End of feed */}
                  {!hasMore && posts.length > 0 && (
                    <EndOfFeed count={posts.length} />
                  )}
                </>
              )}
            </>
          }
          sidebar={<HomeSidebar user={user} />}
        />
      </PageWrapper>

      {/* Back to top button */}
      <BackToTop />
    </>
  );
};

// Need to import PostCard
import PostCard from "../components/posts/PostCard";

export default Home;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import usePostStore from "../store/postStore";
// import useAuthStore from "../store/authStore";
// import useCommunityStore from "../store/communityStore";
// import PostList from "../components/posts/PostList";
// import SortBar from "../components/posts/SortBar";
// import PageWrapper, { TwoColumnLayout } from "../components/layout/PageWrapper";
// import { SidebarSkeleton } from "../components/ui/SkeletonLoader";

// // ─── Home Sidebar ──────────────────────────────────────
// const HomeSidebar = ({ user, communities }) => (
//   <>
//     {/* Home card */}
//     <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
//       <div className="h-10 bg-gradient-to-r from-reddit-orange to-orange-400" />
//       <div className="p-4">
//         <div className="flex items-center gap-2 mb-3">
//           <div className="w-9 h-9 bg-reddit-orange rounded-full flex items-center justify-center -mt-6 border-2 border-white">
//             <span className="text-white font-bold text-sm">R</span>
//           </div>
//           <span className="font-bold text-gray-900">Home</span>
//         </div>
//         <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//           Your personal Reddit frontpage. Come here to check in with your
//           favourite communities.
//         </p>
//         {user ? (
//           <div className="space-y-2">
//             <Link to="/create-community">
//               <button className="btn-primary w-full">Create Community</button>
//             </Link>
//             <Link to="/communities">
//               <button className="btn-secondary w-full">
//                 Explore Communities
//               </button>
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-2">
//             <Link to="/register">
//               <button className="btn-primary w-full">Get Started</button>
//             </Link>
//             <Link to="/login">
//               <button className="btn-secondary w-full">Log In</button>
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Top communities */}
//     {communities.length > 0 && (
//       <div className="bg-white border border-gray-200 rounded-md p-4">
//         <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
//           🔥 Top Communities
//         </h3>
//         <div className="space-y-1">
//           {communities.slice(0, 5).map((c, i) => (
//             <Link
//               key={c.id}
//               to={`/r/${c.slug}`}
//               className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
//             >
//               <span className="text-xs text-gray-400 font-bold w-4 text-center">
//                 {i + 1}
//               </span>
//               <div className="w-7 h-7 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 flex items-center justify-center flex-shrink-0">
//                 <span className="text-white text-xs font-bold">
//                   {c.name[0].toUpperCase()}
//                 </span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-800 group-hover:text-reddit-orange transition-colors truncate">
//                   r/{c.name}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {c._count.members.toLocaleString()} members
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//         <Link to="/communities">
//           <button className="text-xs text-reddit-blue hover:underline mt-3 w-full text-center block py-1">
//             View All Communities →
//           </button>
//         </Link>
//       </div>
//     )}

//     {/* Footer */}
//     <div className="text-xs text-gray-400 px-2 space-y-1">
//       <p>Reddit Clone — Built with PERN Stack</p>
//       <p>React • Node.js • PostgreSQL • Prisma</p>
//     </div>
//   </>
// );

// // ─── Create Post Box ───────────────────────────────────
// const CreatePostBox = ({ user }) => (
//   <div className="card p-2 flex items-center gap-2 mb-4">
//     <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
//       {user ? (
//         <span className="text-gray-600 font-bold text-sm">
//           {user.username[0].toUpperCase()}
//         </span>
//       ) : (
//         <span className="text-gray-400 text-lg">👤</span>
//       )}
//     </div>
//     <Link to={user ? "/communities" : "/login"} className="flex-1">
//       <input
//         type="text"
//         placeholder="Create Post"
//         readOnly
//         className="input cursor-pointer bg-gray-50 hover:bg-white hover:border-reddit-blue transition-all"
//       />
//     </Link>
//     <Link to={user ? "/communities" : "/login"}>
//       <button className="btn-ghost p-2" title="Image post">
//         🖼
//       </button>
//     </Link>
//     <Link to={user ? "/communities" : "/login"}>
//       <button className="btn-ghost p-2" title="Link post">
//         🔗
//       </button>
//     </Link>
//   </div>
// );

// // ─── Home Page ─────────────────────────────────────────
// const Home = () => {
//   const [sort, setSort] = useState("new");
//   const { posts, isLoading, fetchPosts } = usePostStore();
//   const { user } = useAuthStore();
//   const {
//     communities,
//     isLoading: commLoading,
//     fetchAllCommunities,
//   } = useCommunityStore();

//   useEffect(() => {
//     fetchPosts(sort);
//   }, [sort]);

//   useEffect(() => {
//     fetchAllCommunities();
//   }, []);

//   return (
//     <PageWrapper>
//       <TwoColumnLayout
//         main={
//           <>
//             <CreatePostBox user={user} />
//             <SortBar sort={sort} onSort={setSort} />
//             <PostList posts={posts} isLoading={isLoading} showCommunity />
//           </>
//         }
//         sidebar={
//           commLoading ? (
//             <SidebarSkeleton />
//           ) : (
//             <HomeSidebar user={user} communities={communities} />
//           )
//         }
//       />
//     </PageWrapper>
//   );
// };

// export default Home;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import usePostStore from "../store/postStore";
// import useAuthStore from "../store/authStore";
// import useCommunityStore from "../store/communityStore";
// import PostList from "../components/posts/PostList";
// import SortBar from "../components/posts/SortBar";
// import CommunityCard from "../components/communities/CommunityCard";

// const Home = () => {
//   const [sort, setSort] = useState("new");
//   const { posts, isLoading, fetchPosts } = usePostStore();
//   const { user } = useAuthStore();
//   const { communities, fetchAllCommunities } = useCommunityStore();

//   useEffect(() => {
//     fetchPosts(sort);
//     fetchAllCommunities();
//   }, [sort]);

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-6">
//       <div className="flex gap-6">
//         {/* Main Feed */}
//         <div className="flex-1 min-w-0">
//           {/* Create Post Box */}
//           {user && (
//             <div className="card p-2 flex items-center gap-2 mb-4">
//               <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-500 font-bold text-sm">
//                   {user.username[0].toUpperCase()}
//                 </span>
//               </div>
//               <Link to="/r/webdev/submit" className="flex-1">
//                 <input
//                   type="text"
//                   placeholder="Create Post"
//                   readOnly
//                   className="input cursor-pointer hover:bg-gray-50"
//                 />
//               </Link>
//             </div>
//           )}

//           <SortBar sort={sort} onSort={setSort} />
//           <PostList posts={posts} isLoading={isLoading} showCommunity={true} />
//         </div>

//         {/* Right Sidebar */}
//         <div className="w-80 flex-shrink-0 hidden lg:block space-y-4">
//           {/* Home Card */}
//           <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
//             <div className="h-8 bg-gradient-to-r from-reddit-orange to-orange-400" />
//             <div className="p-4">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="w-9 h-9 bg-reddit-orange rounded-full flex items-center justify-center">
//                   <span className="text-white font-bold">R</span>
//                 </div>
//                 <span className="font-bold text-gray-900">Home</span>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">
//                 Your personal Reddit frontpage. Come here to check in with your
//                 favourite communities.
//               </p>
//               {user ? (
//                 <Link to="/create-community">
//                   <button className="btn-primary w-full mb-2">
//                     Create Community
//                   </button>
//                 </Link>
//               ) : (
//                 <div className="space-y-2">
//                   <Link to="/register">
//                     <button className="btn-primary w-full">Get Started</button>
//                   </Link>
//                   <Link to="/login">
//                     <button className="btn-secondary w-full">Log In</button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Top Communities */}
//           {communities.length > 0 && (
//             <div className="bg-white border border-gray-200 rounded-md p-4">
//               <h3 className="font-bold text-gray-900 mb-3">Top Communities</h3>
//               <div className="space-y-2">
//                 {communities.slice(0, 5).map((c, i) => (
//                   <Link
//                     key={c.id}
//                     to={`/r/${c.slug}`}
//                     className="flex items-center gap-2 text-sm hover:bg-gray-50 p-1 rounded"
//                   >
//                     <span className="text-gray-400 font-bold w-4">{i + 1}</span>
//                     <div className="w-6 h-6 rounded-full bg-reddit-orange flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">
//                         {c.name[0].toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="text-gray-700 font-medium">
//                       r/{c.name}
//                     </span>
//                   </Link>
//                 ))}
//               </div>
//               <Link to="/communities">
//                 <button className="text-xs text-reddit-blue hover:underline mt-3 w-full text-center block">
//                   View All Communities →
//                 </button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// import { Link } from "react-router-dom";
// import useAuthStore from "../store/authStore";

// const Home = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh] text-center">
//       <div className="w-20 h-20 bg-reddit-orange rounded-full flex items-center justify-center mb-6">
//         <span className="text-white text-4xl font-bold">R</span>
//       </div>
//       <h1 className="text-4xl font-bold text-gray-800 mb-3">
//         Welcome to Reddit Clone
//       </h1>
//       <p className="text-gray-500 mb-8 max-w-md">
//         {user
//           ? `Hey u/${user.username}! Communities and posts are coming next 🚀`
//           : "The front page of your internet. Sign up to join communities and start posting."}
//       </p>
//       <div className="flex gap-3">
//         {user ? (
//           <Link to="/communities">
//             <button className="btn-primary">Browse Communities</button>
//           </Link>
//         ) : (
//           <>
//             <Link to="/register">
//               <button className="btn-primary">Get Started</button>
//             </Link>
//             <Link to="/login">
//               <button className="btn-secondary">Log In</button>
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;
