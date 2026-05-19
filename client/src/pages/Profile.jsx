import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import useAuthStore from "../store/authStore";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePostCard from "../components/profile/ProfilePostCard";
import ProfileCommentCard from "../components/profile/ProfileCommentCard";
import SettingsPanel from "../components/profile/SettingsPanel";
import EmptyState from "../components/ui/EmptyState";
import { PostSkeleton, CommentSkeleton } from "../components/ui/SkeletonLoader";
import PageWrapper from "../components/layout/PageWrapper";

// ── Profile Skeleton ───────────────────────────────────
const ProfileSkeleton = () => (
  <PageWrapper>
    {/* Header skeleton */}
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-4 animate-pulse">
      <div className="h-24 bg-gray-200" />
      <div className="px-6 pb-5">
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 border-4 border-white" />
          <div className="h-8 w-28 bg-gray-200 rounded-full" />
        </div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
        <div className="flex gap-3 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 w-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
    </div>

    {/* Tabs skeleton */}
    <div className="bg-white border border-gray-200 rounded-md mb-4 h-12 animate-pulse" />

    {/* Content skeleton */}
    <div className="bg-white border border-gray-200 rounded-md p-4 space-y-3">
      {[...Array(4)].map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  </PageWrapper>
);

// ── Load More Button ───────────────────────────────────
const LoadMoreButton = ({ onClick, isLoading, hasMore }) => {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="btn-secondary flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
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
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </button>
    </div>
  );
};

// ── Profile Page ───────────────────────────────────────
const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    profile,
    userPosts,
    userComments,
    isLoadingProfile,
    isLoadingPosts,
    isLoadingComments,
    postsTotal,
    commentsTotal,
    error,
    fetchProfile,
    fetchUserPosts,
    fetchUserComments,
    clearProfile,
  } = useUserStore();

  const [activeTab, setActiveTab] = useState("posts");
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);

  const isOwner = user?.username === username;

  // Fetch profile on mount / username change
  useEffect(() => {
    fetchProfile(username);
    fetchUserPosts(username, 1);
    fetchUserComments(username, 1);
    setPostsPage(1);
    setCommentsPage(1);

    return () => clearProfile();
  }, [username]);

  const handleLoadMorePosts = () => {
    const next = postsPage + 1;
    setPostsPage(next);
    fetchUserPosts(username, next);
  };

  const handleLoadMoreComments = () => {
    const next = commentsPage + 1;
    setCommentsPage(next);
    fetchUserComments(username, next);
  };

  // ── Loading ──────────────────────────────────────────
  if (isLoadingProfile) return <ProfileSkeleton />;

  // ── Not Found ────────────────────────────────────────
  if (error || !profile) {
    return (
      <PageWrapper>
        <div className="card">
          <EmptyState
            emoji="👤"
            title="User not found"
            subtitle={`u/${username} doesn't exist or has been deleted.`}
            action={() => navigate("/")}
            actionLabel="Go Home"
          />
        </div>
      </PageWrapper>
    );
  }

  const hasMorePosts = userPosts.length < postsTotal;
  const hasMoreComments = userComments.length < commentsTotal;

  return (
    <PageWrapper>
      {/* Profile header */}
      <ProfileHeader profile={profile} />

      {/* Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOwner={isOwner}
      />

      {/* ── Posts Tab ────────────────────────────── */}
      {activeTab === "posts" && (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {isLoadingPosts && postsPage === 1 ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <EmptyState
              type="posts"
              title={
                isOwner
                  ? "You haven't posted yet"
                  : `u/${username} hasn't posted yet`
              }
              subtitle={isOwner ? "Share something with a community!" : ""}
              action={isOwner ? () => navigate("/communities") : undefined}
              actionLabel={isOwner ? "Browse Communities" : undefined}
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {userPosts.map((post) => (
                <ProfilePostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <div className="px-4 pb-4">
            <LoadMoreButton
              onClick={handleLoadMorePosts}
              isLoading={isLoadingPosts && postsPage > 1}
              hasMore={hasMorePosts}
            />
          </div>
        </div>
      )}

      {/* ── Comments Tab ─────────────────────────── */}
      {activeTab === "comments" && (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          {isLoadingComments && commentsPage === 1 ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          ) : userComments.length === 0 ? (
            <EmptyState
              type="comments"
              title={
                isOwner
                  ? "You haven't commented yet"
                  : `u/${username} hasn't commented yet`
              }
              subtitle={isOwner ? "Join the discussion on a post!" : ""}
            />
          ) : (
            <div className="divide-y divide-gray-100 p-2">
              {userComments.map((comment) => (
                <ProfileCommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}

          <div className="px-4 pb-4">
            <LoadMoreButton
              onClick={handleLoadMoreComments}
              isLoading={isLoadingComments && commentsPage > 1}
              hasMore={hasMoreComments}
            />
          </div>
        </div>
      )}

      {/* ── Settings Tab (owner only) ─────────────── */}
      {activeTab === "settings" && isOwner && <SettingsPanel />}
    </PageWrapper>
  );
};

export default Profile;
