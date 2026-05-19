import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import { registerSchema } from "../schemas/auth.schema";
import FormError from "../components/ui/FormError";
import Divider from "../components/ui/Divider";
import { Spinner } from "../components/ui/Spinner";

const Register = () => {
  const { register: registerUser, isLoading, user } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { label: "", color: "" },
      { label: "Weak", color: "bg-red-400" },
      { label: "Fair", color: "bg-yellow-400" },
      { label: "Good", color: "bg-blue-400" },
      { label: "Strong", color: "bg-green-400" },
      { label: "Very Strong", color: "bg-green-500" },
    ];
    return { score, ...levels[Math.min(score, 5)] };
  };

  const strength = getStrength(password);

  const onSubmit = async (formData) => {
    const result = await registerUser(
      formData.email,
      formData.username,
      formData.password,
    );
    if (result.success) {
      toast.success("Account created! Welcome 🎉");
      navigate("/");
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
            Join Reddit Clone
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Create your account to get started
          </p>
        </div>

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
                className={`input ${errors.email ? "border-red-400" : ""}`}
              />
              <FormError message={errors.email?.message} />
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  u/
                </span>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="coolredditor"
                  maxLength={20}
                  className={`input pl-7 ${errors.username ? "border-red-400" : ""}`}
                />
              </div>
              <FormError message={errors.username?.message} />
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
                  placeholder="At least 6 characters"
                  className={`input pr-10 ${errors.password ? "border-red-400" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= strength.score
                            ? strength.color
                            : "bg-gray-200 dark:bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password strength:{" "}
                      <span className="font-medium">{strength.label}</span>
                    </p>
                  )}
                </div>
              )}
              <FormError message={errors.password?.message} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className={`input ${errors.confirmPassword ? "border-red-400" : ""}`}
              />
              <FormError message={errors.confirmPassword?.message} />
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="text-reddit-blue cursor-pointer hover:underline">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-reddit-blue cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <Divider label="Already a redditor?" className="my-5" />

          <Link to="/login">
            <button className="btn-secondary w-full">Log In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import toast from "react-hot-toast";
// import useAuthStore from "../store/authStore";
// import { registerSchema } from "../schemas/auth.schema";
// import FormError from "../components/ui/FormError";

// const Register = () => {
//   const { register: registerUser, isLoading, user } = useAuthStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user) navigate("/");
//   }, [user, navigate]);

//   const {
//     register,
//     handleSubmit,
//     setError,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//   });

//   const password = watch("password", "");

//   const onSubmit = async (formData) => {
//     const result = await registerUser(
//       formData.email,
//       formData.username,
//       formData.password,
//     );

//     if (result.success) {
//       toast.success("Account created! Welcome 🎉");
//       navigate("/");
//     } else {
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
//           <p className="text-gray-500 text-sm">Create your account</p>
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
//               />
//               <FormError message={errors.email?.message} />
//             </div>

//             {/* Username */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
//                 Username
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
//                   u/
//                 </span>
//                 <input
//                   {...register("username")}
//                   type="text"
//                   placeholder="coolredditor"
//                   className={`input pl-8 ${errors.username ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
//                 />
//               </div>
//               <FormError message={errors.username?.message} />
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
//               />
//               <FormError message={errors.password?.message} />

//               {/* Password strength indicator */}
//               {password && (
//                 <div className="mt-2 flex gap-1">
//                   {[1, 2, 3].map((level) => (
//                     <div
//                       key={level}
//                       className={`h-1 flex-1 rounded-full transition-colors ${
//                         password.length >= level * 4
//                           ? level === 1
//                             ? "bg-red-400"
//                             : level === 2
//                               ? "bg-yellow-400"
//                               : "bg-green-400"
//                           : "bg-gray-200"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
//                 Confirm Password
//               </label>
//               <input
//                 {...register("confirmPassword")}
//                 type="password"
//                 placeholder="••••••••"
//                 className={`input ${errors.confirmPassword ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
//               />
//               <FormError message={errors.confirmPassword?.message} />
//             </div>

//             {/* Terms */}
//             <p className="text-xs text-gray-400 text-center">
//               By continuing, you agree to our{" "}
//               <span className="text-reddit-blue cursor-pointer hover:underline">
//                 Terms
//               </span>{" "}
//               and{" "}
//               <span className="text-reddit-blue cursor-pointer hover:underline">
//                 Privacy Policy
//               </span>
//             </p>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="btn-primary w-full"
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
//                   Creating account...
//                 </span>
//               ) : (
//                 "Create Account"
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
//                 Already a redditor?
//               </span>
//             </div>
//           </div>

//           <Link to="/login">
//             <button className="btn-secondary w-full">Log In</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
