import PageWrapper, { TwoColumnLayout } from "../components/layout/PageWrapper";
import {
  PostSkeleton,
  CommunityHeaderSkeleton,
  SidebarSkeleton,
} from "../components/ui/SkeletonLoader";
import EmptyState from "../components/ui/EmptyState";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import useCommunityStore from "../store/communityStore";
import usePostStore from "../store/postStore";
import useAuthStore from "../store/authStore";
import CommunitySidebar from "../components/communities/CommunitySidebar";
import PostList from "../components/posts/PostList";
import SortBar from "../components/posts/SortBar";

const CommunityPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [sort, setSort] = useState("new");

  const {
    currentCommunity,
    isLoading: communityLoading,
    error,
    fetchCommunity,
    checkMembership,
  } = useCommunityStore();
  const {
    posts,
    isLoading: postsLoading,
    fetchPostsByCommunity,
  } = usePostStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCommunity(slug);
    if (user) checkMembership(slug);
  }, [slug, user]);

  useEffect(() => {
    fetchPostsByCommunity(slug, sort);
  }, [slug, sort]);

  // if (communityLoading) {
  //   return (
  //     <div className="max-w-5xl mx-auto px-4 py-6">
  //       <div className="flex gap-6">
  //         <div className="flex-1 space-y-3">
  //           {[...Array(3)].map((_, i) => (
  //             <PostSkeleton key={i} />
  //           ))}
  //         </div>
  //         <div className="w-80 hidden lg:block">
  //           <div className="bg-white border border-gray-200 rounded-md h-64 animate-pulse" />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Replace the loading return block with:
  if (communityLoading) {
    return (
      <div>
        <CommunityHeaderSkeleton />
        <PageWrapper>
          <TwoColumnLayout
            main={
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            }
            sidebar={<SidebarSkeleton />}
          />
        </PageWrapper>
      </div>
    );
  }

  if (error || !currentCommunity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-700">Community not found</h2>
        <button
          onClick={() => navigate("/communities")}
          className="btn-primary"
        >
          Browse Communities
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div className="bg-gradient-to-r from-reddit-orange to-orange-400 h-20" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-4">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 border-4 border-white flex items-center justify-center -mt-6">
              <span className="text-white font-bold text-xl">
                {currentCommunity.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-xl">
                r/{currentCommunity.name}
              </h1>
              <p className="text-gray-500 text-sm">
                {currentCommunity._count.members.toLocaleString()} members
              </p>
            </div>
          </div>
          {user && (
            <Link to={`/r/${slug}/submit`}>
              <button className="btn-primary flex items-center gap-1.5">
                <Plus size={16} /> Create Post
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Layout */}
      {/* Main Layout */}
      <PageWrapper>
        <TwoColumnLayout
          main={
            <>
              {/* Create Post Box */}
              {user && (
                <div className="card p-2 flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-sm">
                      {user.username[0].toUpperCase()}
                    </span>
                  </div>
                  <Link to={`/r/${slug}/submit`} className="flex-1">
                    <input
                      type="text"
                      placeholder="Create Post"
                      readOnly
                      className="input cursor-pointer hover:bg-gray-50"
                    />
                  </Link>
                </div>
              )}

              {/* Sort bar */}
              <SortBar sort={sort} onSort={setSort} />

              {/* Posts */}
              {postsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="card">
                  <EmptyState
                    type="posts"
                    subtitle={`No posts in r/${currentCommunity.name} yet.`}
                    action={
                      user ? () => navigate(`/r/${slug}/submit`) : undefined
                    }
                    actionLabel={user ? "Create the first post" : undefined}
                  />
                </div>
              ) : (
                <PostList
                  posts={posts}
                  isLoading={false}
                  showCommunity={false}
                />
              )}
            </>
          }
          sidebar={<CommunitySidebar community={currentCommunity} />}
        />
      </PageWrapper>
    </div>
  );
};

export default CommunityPage;

// import { useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Plus, ArrowLeft } from "lucide-react";
// import useCommunityStore from "../store/communityStore";
// import useAuthStore from "../store/authStore";
// import CommunitySidebar from "../components/communities/CommunitySidebar";
// import { PostSkeleton } from "../components/ui/SkeletonLoader";

// const CommunityPage = () => {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const {
//     currentCommunity,
//     isLoading,
//     error,
//     fetchCommunity,
//     checkMembership,
//   } = useCommunityStore();
//   const { user } = useAuthStore();

//   useEffect(() => {
//     fetchCommunity(slug);
//     if (user) checkMembership(slug);
//   }, [slug, user]);

//   if (isLoading) {
//     return (
//       <div className="max-w-5xl mx-auto px-4 py-6">
//         <div className="flex gap-6">
//           <div className="flex-1 space-y-3">
//             {[...Array(3)].map((_, i) => (
//               <PostSkeleton key={i} />
//             ))}
//           </div>
//           <div className="w-80 hidden lg:block">
//             <div className="bg-white border border-gray-200 rounded-md h-64 animate-pulse" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !currentCommunity) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <div className="text-6xl">🔍</div>
//         <h2 className="text-xl font-bold text-gray-700">Community not found</h2>
//         <p className="text-gray-400 text-sm">
//           r/{slug} doesn't exist or was removed.
//         </p>
//         <button
//           onClick={() => navigate("/communities")}
//           className="btn-primary"
//         >
//           Browse Communities
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Community Banner */}
//       <div className="bg-gradient-to-r from-reddit-orange to-orange-400 h-20" />

//       {/* Community Header */}
//       <div className="bg-white border-b border-gray-200 mb-4">
//         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {/* Community Avatar */}
//             <div className="w-14 h-14 rounded-full bg-gradient-to-br from-reddit-orange to-orange-400 border-4 border-white flex items-center justify-center -mt-6">
//               <span className="text-white font-bold text-xl">
//                 {currentCommunity.name[0].toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <h1 className="font-bold text-gray-900 text-xl">
//                 r/{currentCommunity.name}
//               </h1>
//               <p className="text-gray-500 text-sm">
//                 {currentCommunity._count.members.toLocaleString()} members
//               </p>
//             </div>
//           </div>

//           {/* Create Post CTA */}
//           {user && (
//             <Link to={`/r/${slug}/submit`}>
//               <button className="btn-primary flex items-center gap-1.5">
//                 <Plus size={16} /> Create Post
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="max-w-5xl mx-auto px-4 pb-8">
//         <div className="flex gap-6">
//           {/* Posts Column */}
//           <div className="flex-1 min-w-0">
//             {/* Create Post Box */}
//             {user && (
//               <div className="card p-2 flex items-center gap-2 mb-4">
//                 <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
//                   <span className="text-gray-500 font-bold text-sm">
//                     {user.username[0].toUpperCase()}
//                   </span>
//                 </div>
//                 <Link to={`/r/${slug}/submit`} className="flex-1">
//                   <input
//                     type="text"
//                     placeholder="Create Post"
//                     readOnly
//                     className="input cursor-pointer hover:bg-gray-50"
//                   />
//                 </Link>
//               </div>
//             )}

//             {/* Posts will be loaded here on Day 4 */}
//             <div className="card p-8 text-center text-gray-400">
//               <div className="text-4xl mb-3">📝</div>
//               <p className="font-semibold text-gray-600">No posts yet</p>
//               <p className="text-sm mt-1">
//                 Be the first to post in r/{currentCommunity.name}
//               </p>
//               {user && (
//                 <Link to={`/r/${slug}/submit`}>
//                   <button className="btn-primary mt-4">Create Post</button>
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="w-80 flex-shrink-0 hidden lg:block">
//             <CommunitySidebar community={currentCommunity} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommunityPage;

// // main layout

// <div className="max-w-5xl mx-auto px-4 pb-8">
//         <div className="flex gap-6">
//           <div className="flex-1 min-w-0">
//             {/* Create Post Box */}
//             {user && (
//               <div className="card p-2 flex items-center gap-2 mb-4">
//                 <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
//                   <span className="text-gray-500 font-bold text-sm">
//                     {user.username[0].toUpperCase()}
//                   </span>
//                 </div>
//                 <Link to={`/r/${slug}/submit`} className="flex-1">
//                   <input
//                     type="text"
//                     placeholder="Create Post"
//                     readOnly
//                     className="input cursor-pointer hover:bg-gray-50"
//                   />
//                 </Link>
//               </div>
//             )}

//             {/* Sort Bar */}
//             <SortBar sort={sort} onSort={setSort} />

//             {/* Posts */}
//             <PostList
//               posts={posts}
//               isLoading={postsLoading}
//               showCommunity={false}
//             />
//           </div>

//           {/* Sidebar */}
//           <div className="w-80 flex-shrink-0 hidden lg:block">
//             <CommunitySidebar community={currentCommunity} />
//           </div>
//         </div>
//       </div>
