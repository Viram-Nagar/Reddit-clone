import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";
import useApiError from "./hooks/useApiError";
import ErrorBoundary from "./components/errors/ErrorBoundary";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute, { GuestRoute } from "./components/layout/ProtectedRoute";
import ScrollToTop from "./components/ui/ScrollToTop";
import BackToTop from "./components/ui/BackToTop";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Communities from "./pages/Communities";
import CommunityPage from "./pages/CommunityPage";
import CreateCommunity from "./pages/CreateCommunity";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// ─── Inner app — needs router context for useNavigate ─
const AppInner = () => {
  const { checkAuth } = useAuthStore();

  // Wire global API error handler
  useApiError();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px", borderRadius: "8px" },
          success: {
            iconTheme: { primary: "#FF4500", secondary: "white" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "white" },
          },
        }}
      />
      <Navbar />
      <BackToTop />

      <main className="min-h-screen bg-gray-100">
        <Routes>
          {/* ── Public routes ──────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/r/:slug" element={<CommunityPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/u/:username" element={<Profile />} />

          {/* ── Guest-only routes ──────────────── */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* ── Protected routes ───────────────── */}
          <Route
            path="/r/:slug/submit"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-community"
            element={
              <ProtectedRoute>
                <CreateCommunity />
              </ProtectedRoute>
            }
          />

          {/* ── 404 ──────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

// ─── Root App — wraps everything in ErrorBoundary ──────
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useEffect } from "react";
// import useAuthStore from "./store/authStore";
// import Navbar from "./components/layout/Navbar";
// import ProtectedRoute from "./components/layout/ProtectedRoute";
// import ScrollToTop from "./components/ui/ScrollToTop";

// // Pages
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Communities from "./pages/Communities";
// import CommunityPage from "./pages/CommunityPage";
// import CreateCommunity from "./pages/CreateCommunity";
// import CreatePost from "./pages/CreatePost";
// import PostDetail from "./pages/PostDetail";
// import NotFound from "./pages/NotFound";
// import Profile from "./pages/Profile";
// import BackToTop from "./components/ui/BackToTop";

// function App() {
//   const { checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return (
//     <BrowserRouter>
//       <ScrollToTop />
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: { fontSize: "14px", borderRadius: "8px" },
//           success: {
//             iconTheme: { primary: "#FF4500", secondary: "white" },
//           },
//         }}
//       />
//       <Navbar />
//       <BackToTop />
//       <main className="min-h-screen bg-gray-100">
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/communities" element={<Communities />} />
//           <Route path="/r/:slug" element={<CommunityPage />} />
//           <Route path="/post/:id" element={<PostDetail />} />
//           <Route path="/u/:username" element={<Profile />} />

//           {/* Protected */}
//           <Route
//             path="/r/:slug/submit"
//             element={
//               <ProtectedRoute>
//                 <CreatePost />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/create-community"
//             element={
//               <ProtectedRoute>
//                 <CreateCommunity />
//               </ProtectedRoute>
//             }
//           />

//           {/* 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { useEffect } from "react";
// import useAuthStore from "./store/authStore";
// import Navbar from "./components/layout/Navbar";
// import ProtectedRoute from "./components/layout/ProtectedRoute";

// // Pages
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Communities from "./pages/Communities";
// import CommunityPage from "./pages/CommunityPage";
// import CreateCommunity from "./pages/CreateCommunity";
// import CreatePost from "./pages/CreatePost";
// import PostDetail from "./pages/PostDetail";

// const ComingSoon = ({ page }) => (
//   <div className="flex items-center justify-center min-h-[80vh] flex-col gap-3">
//     <div className="w-16 h-16 bg-reddit-orange rounded-full flex items-center justify-center">
//       <span className="text-white text-2xl">🚧</span>
//     </div>
//     <h1 className="text-xl font-bold text-gray-700">{page}</h1>
//     <p className="text-gray-400 text-sm">Coming in the next session!</p>
//   </div>
// );

// function App() {
//   const { checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return (
//     <BrowserRouter>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: { fontSize: "14px" },
//           success: { iconTheme: { primary: "#FF4500", secondary: "white" } },
//         }}
//       />
//       <Navbar />
//       <main>
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/communities" element={<Communities />} />
//           <Route path="/r/:slug" element={<CommunityPage />} />
//           <Route path="/post/:id" element={<PostDetail />} />
//           {/* <Route
//             path="/post/:id"
//             element={<ComingSoon page="Post Detail — Day 4" />}
//           /> */}
//           <Route
//             path="/u/:username"
//             element={<ComingSoon page="User Profile — Day 8" />}
//           />

//           {/* Protected */}
//           <Route
//             path="/r/:slug/submit"
//             element={
//               <ProtectedRoute>
//                 <CreatePost />
//               </ProtectedRoute>
//             }
//           />
//           {/* <Route
//             path="/r/:slug/submit"
//             element={
//               <ProtectedRoute>
//                 <ComingSoon page="Create Post — Day 4" />
//               </ProtectedRoute>
//             }
//           /> */}
//           <Route
//             path="/create-community"
//             element={
//               <ProtectedRoute>
//                 <CreateCommunity />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </main>
//     </BrowserRouter>
//   );
// }

// export default App;
