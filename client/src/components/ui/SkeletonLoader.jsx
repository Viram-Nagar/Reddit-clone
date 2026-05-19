// Base pulse block
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// ── Post Card Skeleton ─────────────────────────────────
export const PostSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md flex overflow-hidden">
    {/* Vote column */}
    <div className="w-10 bg-gray-50 flex flex-col items-center py-3 gap-2">
      <Skeleton className="w-5 h-5 rounded" />
      <Skeleton className="w-6 h-3" />
      <Skeleton className="w-5 h-5 rounded" />
    </div>

    {/* Content */}
    <div className="flex-1 p-3 space-y-2">
      <div className="flex gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

// ── Community Card Skeleton ────────────────────────────
export const CommunitySkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md p-4 flex items-start gap-4">
    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// ── Comment Skeleton ───────────────────────────────────
export const CommentSkeleton = () => (
  <div className="flex gap-3 animate-pulse">
    <Skeleton className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
    <div className="flex-1 space-y-2 pb-4">
      <div className="flex gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

// ── Post Detail Skeleton ───────────────────────────────
export const PostDetailSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="px-4 pt-3 pb-2 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-6 w-20 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-md p-4 space-y-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-24 w-full rounded" />
      {[...Array(3)].map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  </div>
);

// ── Community Page Header Skeleton ─────────────────────
export const CommunityHeaderSkeleton = () => (
  <div>
    <Skeleton className="h-20 w-full rounded-none" />
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <Skeleton className="w-14 h-14 rounded-full -mt-6 flex-shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  </div>
);

// ── Sidebar Skeleton ───────────────────────────────────
export const SidebarSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
    <Skeleton className="h-10 w-full rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-6 py-2 border-t border-gray-100">
        <div className="space-y-1">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-3 w-14" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-5 w-10" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <Skeleton className="h-8 w-full rounded-full" />
    </div>
  </div>
);

export default Skeleton;
