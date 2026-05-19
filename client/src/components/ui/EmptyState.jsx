const PRESETS = {
  posts: {
    emoji: "📭",
    title: "No posts yet",
    subtitle: "Be the first to share something with this community!",
  },
  comments: {
    emoji: "💭",
    title: "No comments yet",
    subtitle: "Be the first to share your thoughts!",
  },
  communities: {
    emoji: "🏘️",
    title: "No communities found",
    subtitle: "Try a different search or create your own!",
  },
  search: {
    emoji: "🔍",
    title: "No results found",
    subtitle: "Try adjusting your search terms.",
  },
  feed: {
    emoji: "🌱",
    title: "Your feed is empty",
    subtitle: "Join some communities to see posts here!",
  },
  notFound: {
    emoji: "🚀",
    title: "Page not found",
    subtitle: "Looks like this page has gone to the moon.",
  },
};

const EmptyState = ({
  type = "posts",
  emoji,
  title,
  subtitle,
  action,
  actionLabel,
}) => {
  const preset = PRESETS[type] || PRESETS.posts;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4 select-none">{emoji || preset.emoji}</div>
      <h3 className="font-semibold text-gray-700 text-lg mb-1">
        {title || preset.title}
      </h3>
      <p className="text-gray-400 text-sm max-w-xs">
        {subtitle || preset.subtitle}
      </p>
      {action && actionLabel && (
        <button onClick={action} className="btn-primary mt-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
