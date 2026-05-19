import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { loginSchema } from "../schemas/auth.schema";
import FormError from "../components/ui/FormError";
import Divider from "../components/ui/Divider";
import { Spinner } from "../components/ui/Spinner";

const Login = () => {
  const { login, isLoading, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success("Welcome back! 👋");
      navigate(from, { replace: true });
    } else {
      result.errors?.forEach(({ field, message }) => {
        setError(field, { message });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 bg-reddit-orange rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-2xl font-bold">R</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Log in to your Reddit Clone account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`input ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
              />
              <FormError message={errors.email?.message} />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`input pr-10 ${errors.password ? "border-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FormError message={errors.password?.message} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Log In
                </>
              )}
            </button>
          </form>

          <Divider label="New to Reddit Clone?" className="my-5" />

          <Link to="/register">
            <button className="btn-secondary w-full">Create an Account</button>
          </Link>
        </div>

        {/* Test credentials hint in dev */}
        {import.meta.env.DEV && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              🧪 Dev hint: alice@example.com / password123
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import toast from "react-hot-toast";
// import useAuthStore from "../store/authStore";
// import { loginSchema } from "../schemas/auth.schema";
// import FormError from "../components/ui/FormError";

// const Login = () => {
//   const { login, isLoading, user } = useAuthStore();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showPassword, setShowPassword] = useState(false);

//   // ── Redirect to where user came from after login ────
//   const from = location.state?.from || "/";

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) navigate("/", { replace: true });
//   }, [user, navigate]);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (formData) => {
//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       toast.success("Welcome back! 👋");
//       navigate(from, { replace: true }); // ← redirect back to original page
//     } else {
//       // Map server errors back to form fields
//       result.errors?.forEach(({ field, message }) => {
//         setError(field, { message });
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {/* ── Logo ──────────────────────────────────── */}
//         <div className="text-center mb-8">
//           <Link to="/" className="inline-flex items-center gap-2 group">
//             <div className="w-10 h-10 bg-[#FF4500] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
//               <span className="text-white text-xl font-bold">R</span>
//             </div>
//             <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//               reddit
//             </span>
//           </Link>
//           <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
//             Log in to continue
//           </p>
//         </div>

//         {/* ── Card ──────────────────────────────────── */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
//                 Email
//               </label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 className={`input ${
//                   errors.email
//                     ? "border-red-400 focus:border-red-400 focus:ring-red-400"
//                     : ""
//                 }`}
//               />
//               <FormError message={errors.email?.message} />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   {...register("password")}
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   autoComplete="current-password"
//                   className={`input pr-10 ${
//                     errors.password
//                       ? "border-red-400 focus:border-red-400 focus:ring-red-400"
//                       : ""
//                   }`}
//                 />
//                 {/* Show/hide password toggle */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((p) => !p)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                 </button>
//               </div>
//               <FormError message={errors.password?.message} />
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full mt-2"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8z"
//                     />
//                   </svg>
//                   Logging in...
//                 </span>
//               ) : (
//                 "Log In"
//               )}
//             </button>
//           </form>

//           {/* ── Divider ───────────────────────────────── */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200 dark:border-gray-700" />
//             </div>
//             <div className="relative flex justify-center text-xs">
//               <span className="px-2 bg-white dark:bg-gray-800 text-gray-400">
//                 New to Reddit?
//               </span>
//             </div>
//           </div>

//           <Link to="/register">
//             <button className="btn-secondary w-full">Create an account</button>
//           </Link>
//         </div>

//         {/* ── Dev hint ──────────────────────────────── */}
//         {import.meta.env.DEV && (
//           <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
//             <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
//               🧪 Dev hint: alice@example.com / password123
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import toast from "react-hot-toast";
// import useAuthStore from "../store/authStore";
// import { loginSchema } from "../schemas/auth.schema";
// import FormError from "../components/ui/FormError";

// const Login = () => {
//   const { login, isLoading, user } = useAuthStore();
//   const navigate = useNavigate();

//   // Redirect if already logged in
//   useEffect(() => {
//     if (user) navigate("/");
//   }, [user, navigate]);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//   });

//   const onSubmit = async (formData) => {
//     const result = await login(formData.email, formData.password);

//     if (result.success) {
//       toast.success("Welcome back! 👋");
//       navigate("/");
//     } else {
//       // Map server errors back to form fields
//       result.errors?.forEach(({ field, message }) => {
//         setError(field, { message });
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-2 mb-2">
//             <div className="w-10 h-10 bg-reddit-orange rounded-full flex items-center justify-center">
//               <span className="text-white text-xl font-bold">R</span>
//             </div>
//             <span className="text-2xl font-bold text-gray-800">reddit</span>
//           </div>
//           <p className="text-gray-500 text-sm">Log in to continue</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-lg border border-gray-200 p-8">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
//                 Email
//               </label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="you@example.com"
//                 className={`input ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
//                 autoComplete="email"
//               />
//               <FormError message={errors.email?.message} />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
//                 Password
//               </label>
//               <input
//                 {...register("password")}
//                 type="password"
//                 placeholder="••••••••"
//                 className={`input ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
//                 autoComplete="current-password"
//               />
//               <FormError message={errors.password?.message} />
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full mt-2"
//             >
//               {isLoading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-4 w-4"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8z"
//                     />
//                   </svg>
//                   Logging in...
//                 </span>
//               ) : (
//                 "Log In"
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200" />
//             </div>
//             <div className="relative flex justify-center text-xs">
//               <span className="px-2 bg-white text-gray-400">
//                 New to Reddit?
//               </span>
//             </div>
//           </div>

//           <Link to="/register">
//             <button className="btn-secondary w-full">Create an account</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
