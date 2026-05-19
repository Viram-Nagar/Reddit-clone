// Consistent max-width + padding for all pages
const PageWrapper = ({ children, className = "" }) => (
  <div className={`max-w-5xl mx-auto px-4 py-6 ${className}`}>{children}</div>
);

// Two-column layout: main content + sidebar
export const TwoColumnLayout = ({ main, sidebar }) => (
  <div className="flex gap-6">
    <div className="flex-1 min-w-0">{main}</div>
    <aside className="w-80 flex-shrink-0 hidden lg:block space-y-4">
      {sidebar}
    </aside>
  </div>
);

export default PageWrapper;
