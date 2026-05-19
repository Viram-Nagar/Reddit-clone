import { FileText, MessageSquare, Settings } from "lucide-react";

const TABS = [
  { id: "posts", label: "Posts", icon: <FileText size={15} /> },
  { id: "comments", label: "Comments", icon: <MessageSquare size={15} /> },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={15} />,
    ownerOnly: true,
  },
];

const ProfileTabs = ({ activeTab, onTabChange, isOwner }) => {
  const visibleTabs = TABS.filter((t) => !t.ownerOnly || isOwner);

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 overflow-hidden">
      <div className="flex">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all flex-1 justify-center ${
              activeTab === tab.id
                ? "border-reddit-orange text-reddit-orange bg-orange-50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span
              className={
                activeTab === tab.id ? "text-reddit-orange" : "text-gray-400"
              }
            >
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
