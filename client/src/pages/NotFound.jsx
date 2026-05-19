import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="text-9xl font-black text-gray-100 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">🚀</div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-3">Page not found</h1>
      <p className="text-gray-500 mb-2 max-w-sm">
        Hmm. The page you were looking for doesn't seem to exist.
      </p>
      <p className="text-gray-400 text-sm mb-8">
        It may have been moved, deleted, or maybe it never existed.
      </p>

      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          ← Go Back
        </button>
        <button onClick={() => navigate("/")} className="btn-primary">
          Go Home
        </button>
      </div>

      {/* Fun links */}
      <div className="mt-10 text-sm text-gray-400">
        Try visiting{" "}
        <button
          onClick={() => navigate("/communities")}
          className="text-reddit-blue hover:underline"
        >
          r/communities
        </button>{" "}
        instead
      </div>
    </div>
  );
};

export default NotFound;
