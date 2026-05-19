import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Plus, X } from "lucide-react";
import useCommunityStore from "../store/communityStore";
import useAuthStore from "../store/authStore";
import CommunityCard from "../components/communities/CommunityCard";
import { CommunitySkeleton } from "../components/ui/SkeletonLoader";
import EmptyState from "../components/ui/EmptyState";
import PageWrapper from "../components/layout/PageWrapper";

const Communities = () => {
  const { communities, isLoading, fetchAllCommunities } = useCommunityStore();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    fetchAllCommunities();
  }, []);

  // Sync search param from Navbar search
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = communities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const clearSearch = () => {
    setSearch("");
    setSearchParams({});
  };

  return (
    <PageWrapper className="dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Explore Communities
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {communities.length} communities and counting
          </p>
        </div>
        {user && (
          <Link to="/create-community">
            <button className="btn-primary flex items-center gap-1.5">
              <Plus size={16} /> Create
            </button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search communities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9 pr-9"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <CommunitySkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            type="communities"
            subtitle={
              search
                ? `No communities match "${search}"`
                : "Be the first to create a community!"
            }
            action={search ? clearSearch : user ? () => {} : undefined}
            actionLabel={search ? "Clear search" : undefined}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default Communities;

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { Search, Plus } from "lucide-react";
// import useCommunityStore from "../store/communityStore";
// import useAuthStore from "../store/authStore";
// import CommunityCard from "../components/communities/CommunityCard";
// import { PostSkeleton } from "../components/ui/SkeletonLoader";

// const Communities = () => {
//   const { communities, isLoading, fetchAllCommunities } = useCommunityStore();
//   const { user } = useAuthStore();
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     fetchAllCommunities();
//   }, [fetchAllCommunities]);

//   const filtered = communities.filter(
//     (c) =>
//       c.name.toLowerCase().includes(search.toLowerCase()) ||
//       c.description?.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="max-w-3xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Explore Communities
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             {communities.length} communities and counting
//           </p>
//         </div>
//         {user && (
//           <Link to="/create-community">
//             <button className="btn-primary flex items-center gap-1.5">
//               <Plus size={16} /> Create
//             </button>
//           </Link>
//         )}
//       </div>

//       {/* Search */}
//       <div className="relative mb-6">
//         <Search
//           size={16}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//         />
//         <input
//           type="text"
//           placeholder="Search communities..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="input pl-9"
//         />
//       </div>

//       {/* Communities List */}
//       {isLoading ? (
//         <div className="space-y-3">
//           {[...Array(5)].map((_, i) => (
//             <PostSkeleton key={i} />
//           ))}
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="text-5xl mb-4">🏜️</div>
//           <h3 className="font-semibold text-gray-700 text-lg">
//             {search ? "No communities found" : "No communities yet"}
//           </h3>
//           <p className="text-gray-400 text-sm mt-1">
//             {search
//               ? "Try a different search term"
//               : "Be the first to create one!"}
//           </p>
//           {!search && user && (
//             <Link to="/create-community">
//               <button className="btn-primary mt-4">Create Community</button>
//             </Link>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((community) => (
//             <CommunityCard key={community.id} community={community} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Communities;
