import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  User,
  PlusCircle,
  LogOut,
  Compass,
  Moon,
  Sun,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import useFeedStore from "../../store/feedStore";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import MobileMenu from "./MobileMenu";
import useTheme from "../../hooks/useTheme";

// ─── Search Bar Component ──────────────────────────────
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const debouncedQuery = useDebouncedSearch(query, 400);
  const { search, searchResults, isSearching, clearSearch } = useFeedStore();
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fire search when debounced query changes
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown =
    focused &&
    query.length >= 2 &&
    (searchResults.posts?.length > 0 ||
      searchResults.communities?.length > 0 ||
      isSearching);

  const handleSelect = (path) => {
    setQuery("");
    clearSearch();
    setFocused(false);
    navigate(path);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/communities?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setFocused(false);
    }
  };

  return (
    <div ref={searchRef} className="flex-1 max-w-lg mx-2 relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search Reddit Clone..."
            className={`w-full pl-8 pr-8 py-1.5 text-sm border rounded-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 transition-all focus:outline-none focus:bg-white dark:focus:bg-gray-700 ${
              focused
                ? "border-blue-500 ring-1 ring-blue-500"
                : "border-gray-200 dark:border-gray-600"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                clearSearch();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </form>

      {/* ── Search Dropdown ──────────────────────────── */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <svg
                className="animate-spin h-5 w-5 text-[#FF4500]"
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
            </div>
          ) : (
            <>
              {/* Communities results */}
              {searchResults.communities?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-3 py-2 bg-gray-50 dark:bg-gray-900">
                    Communities
                  </p>
                  {searchResults.communities.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect(`/r/${c.slug}`)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FF4500] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {c.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          r/{c.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {c._count.members.toLocaleString()} members
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Posts results */}
              {searchResults.posts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide px-3 py-2 bg-gray-50 dark:bg-gray-900">
                    Posts
                  </p>
                  {searchResults.posts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect(`/post/${p.id}`)}
                      className="flex items-start gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-sm">
                          {p.type === "image"
                            ? "🖼"
                            : p.type === "link"
                              ? "🔗"
                              : "📝"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          r/{p.community.name} • {p.voteScore} points
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {!searchResults.communities?.length &&
                !searchResults.posts?.length && (
                  <div className="py-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No results for "{query}"
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Try a different search term
                    </p>
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Navbar Component ─────────────────────────────
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <>
      <header className="navbar">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-3">
          {/* ── Mobile menu button ───────────────────── */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-300" />
          </button>

          {/* ── Logo ────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#FF4500] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-100 text-lg hidden sm:block">
              reddit
            </span>
          </Link>

          {/* ── Search bar ──────────────────────────── */}
          <SearchBar />

          {/* ── Desktop nav ─────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {/* Explore link */}
            <Link to="/communities">
              <button className="btn-ghost text-sm flex items-center gap-1.5">
                <Compass size={16} />
                Explore
              </button>
            </Link>

            {user ? (
              <>
                {/* Create community */}
                <Link to="/create-community">
                  <button className="btn-ghost text-sm flex items-center gap-1.5">
                    <PlusCircle size={16} />
                    Create
                  </button>
                </Link>

                {/* <button
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className={`p-2 rounded-full transition-all ${
                    isDark
                      ? "text-yellow-400 hover:bg-yellow-400/10"
                      : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button> */}

                {/* ── User dropdown ──────────────────── */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
                      dropdownOpen
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-6 h-6 rounded-full bg-[#FF4500] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                      {user.username}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 animate-[slideDown_0.2s_ease-out]">
                      {/* User info header */}
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          u/{user.username}
                        </p>
                      </div>

                      {/* Profile link */}
                      <Link to={`/u/${user.username}`}>
                        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <User size={15} className="text-gray-400" />
                          My Profile
                        </button>
                      </Link>

                      {/* Create community */}
                      <Link to="/create-community">
                        <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <PlusCircle size={15} className="text-gray-400" />
                          Create Community
                        </button>
                      </Link>

                      {/* Logout */}
                      <div className="border-t border-gray-100 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Auth buttons
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <button className="btn-secondary text-sm px-4 py-1.5">
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn-primary text-sm px-4 py-1.5">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile: auth buttons (not logged in) ─── */}
          {!user && (
            <div className="flex lg:hidden items-center gap-1.5 flex-shrink-0 ml-auto">
              <Link to="/login">
                <button className="btn-secondary text-xs px-3 py-1.5">
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <button className="btn-primary text-xs px-3 py-1.5">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* ── Mobile: user avatar ───────────────────── */}
          {user && (
            <div className="flex lg:hidden items-center ml-auto">
              <button
                onClick={() => setMobileOpen(true)}
                className="w-7 h-7 rounded-full bg-[#FF4500] flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">
                  {user.username[0].toUpperCase()}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
};

export default Navbar;

// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import {
//   Menu,
//   Search,
//   X,
//   ChevronDown,
//   User,
//   PlusCircle,
//   LogOut,
//   Compass,
// } from "lucide-react";
// import toast from "react-hot-toast";
// import useAuthStore from "../../store/authStore";
// import MobileMenu from "./MobileMenu";
// import { useEffect, useRef, useState } from "react";
// import useDebouncedSearch from "../../hooks/useDebouncedSearch";
// import useFeedStore from "../../store/feedStore";

// const Navbar = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchFocused, setSearchFocused] = useState(false);

//   const dropdownRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Close dropdown on route change
//   useEffect(() => {
//     setDropdownOpen(false);
//   }, [pathname]);

//   const handleLogout = async () => {
//     await logout();
//     toast.success("Logged out!");
//     navigate("/");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/communities?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <>
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//         <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-3">
//           {/* ── Mobile menu button ─────────────────── */}
//           <button
//             onClick={() => setMobileOpen(true)}
//             className="lg:hidden p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
//             aria-label="Open menu"
//           >
//             <Menu size={20} className="text-gray-600" />
//           </button>

//           {/* ── Logo ──────────────────────────────── */}
//           <Link to="/" className="flex items-center gap-2 flex-shrink-0">
//             <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center">
//               <span className="text-white font-bold text-sm">R</span>
//             </div>
//             <span className="font-bold text-gray-800 text-lg hidden sm:block">
//               reddit
//             </span>
//           </Link>

//           {/* ── Search bar ────────────────────────── */}
//           <form
//             onSubmit={handleSearch}
//             className={`flex-1 max-w-lg mx-2 transition-all ${
//               searchFocused ? "max-w-xl" : ""
//             }`}
//           >
//             <div className="relative">
//               <Search
//                 size={15}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setSearchFocused(true)}
//                 onBlur={() => setSearchFocused(false)}
//                 placeholder="Search communities..."
//                 className={`w-full pl-8 pr-8 py-1.5 text-sm border rounded-full bg-gray-50 transition-all focus:outline-none focus:bg-white focus:border-reddit-blue focus:ring-1 focus:ring-reddit-blue ${
//                   searchFocused ? "border-reddit-blue" : "border-gray-200"
//                 }`}
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={13} />
//                 </button>
//               )}
//             </div>
//           </form>

//           {/* ── Desktop nav ───────────────────────── */}
//           <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
//             <Link to="/communities">
//               <button className="btn-ghost text-sm flex items-center gap-1.5">
//                 <Compass size={16} />
//                 Explore
//               </button>
//             </Link>

//             {user ? (
//               <>
//                 {/* Create post shortcut */}
//                 <Link to="/create-community">
//                   <button className="btn-ghost text-sm">
//                     <PlusCircle size={16} />
//                     Create
//                   </button>
//                 </Link>

//                 {/* User dropdown */}
//                 <div className="relative" ref={dropdownRef}>
//                   <button
//                     onClick={() => setDropdownOpen((p) => !p)}
//                     className={`flex items-center gap-1.5 px-2 py-1 rounded border transition-colors ${
//                       dropdownOpen
//                         ? "border-reddit-blue bg-blue-50"
//                         : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//                     }`}
//                   >
//                     {/* Avatar */}
//                     <div className="w-6 h-6 rounded-full bg-reddit-orange flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">
//                         {user.username[0].toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
//                       {user.username}
//                     </span>
//                     <ChevronDown
//                       size={14}
//                       className={`text-gray-400 transition-transform ${
//                         dropdownOpen ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>

//                   {/* Dropdown menu */}
//                   {dropdownOpen && (
//                     <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
//                       <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
//                         <p className="text-xs text-gray-500">Signed in as</p>
//                         <p className="text-sm font-semibold text-gray-900 truncate">
//                           u/{user.username}
//                         </p>
//                       </div>

//                       <Link to={`/u/${user.username}`}>
//                         <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                           <User size={15} className="text-gray-400" />
//                           My Profile
//                         </button>
//                       </Link>

//                       <Link to="/create-community">
//                         <button className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                           <PlusCircle size={15} className="text-gray-400" />
//                           Create Community
//                         </button>
//                       </Link>

//                       <div className="border-t border-gray-100">
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
//                         >
//                           <LogOut size={15} />
//                           Log Out
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <Link to="/login">
//                   <button className="btn-secondary text-sm px-4 py-1.5">
//                     Log In
//                   </button>
//                 </Link>
//                 <Link to="/register">
//                   <button className="btn-primary text-sm px-4 py-1.5">
//                     Sign Up
//                   </button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* ── Mobile auth shortcut ───────────────── */}
//           {!user && (
//             <div className="flex lg:hidden items-center gap-1.5 flex-shrink-0 ml-auto">
//               <Link to="/login">
//                 <button className="btn-secondary text-xs px-3 py-1.5">
//                   Log In
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="btn-primary text-xs px-3 py-1.5">
//                   Sign Up
//                 </button>
//               </Link>
//             </div>
//           )}

//           {/* ── Mobile user avatar ─────────────────── */}
//           {user && (
//             <div className="flex lg:hidden items-center ml-auto">
//               <button
//                 onClick={() => setMobileOpen(true)}
//                 className="w-7 h-7 rounded-full bg-reddit-orange flex items-center justify-center"
//               >
//                 <span className="text-white text-xs font-bold">
//                   {user.username[0].toUpperCase()}
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* Mobile slide-out menu */}
//       <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//     </>
//   );
// };

// export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import useAuthStore from "../../store/authStore";

// const Navbar = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     toast.success("Logged out!");
//     navigate("/");
//   };

//   return (
//     <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-reddit-orange rounded-full flex items-center justify-center">
//             <span className="text-white font-bold text-sm">R</span>
//           </div>
//           <span className="font-bold text-gray-800 hidden sm:block">
//             reddit
//           </span>
//         </Link>

//         {/* Search Bar */}
//         <div className="flex-1 max-w-sm mx-4">
//           <input
//             type="text"
//             placeholder="Search Reddit"
//             className="input text-sm py-1.5"
//           />
//         </div>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-2">
//           {user ? (
//             <>
//               <Link to="/create-community">
//                 <button className="btn-ghost hidden sm:flex">
//                   + Community
//                 </button>
//               </Link>
//               <div className="flex items-center gap-2">
//                 <Link to={`/u/${user.username}`}>
//                   <div className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
//                     <div className="w-6 h-6 bg-reddit-orange rounded-full flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">
//                         {user.username[0].toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="text-sm font-medium hidden sm:block">
//                       {user.username}
//                     </span>
//                   </div>
//                 </Link>
//                 <button onClick={handleLogout} className="btn-ghost text-xs">
//                   Logout
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link to="/login">
//                 <button className="btn-secondary text-sm px-4 py-1.5">
//                   Log In
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="btn-primary text-sm px-4 py-1.5">
//                   Sign Up
//                 </button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
