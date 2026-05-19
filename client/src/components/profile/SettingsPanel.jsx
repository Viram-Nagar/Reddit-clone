import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useUserStore from "../../store/userStore";
import FormError from "../ui/FormError";

// ─── Password Schema ───────────────────────────────────
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── Password Field ────────────────────────────────────
const PasswordField = ({ label, name, register, error, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`input pr-10 ${error ? "border-red-400" : ""}`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      <FormError message={error?.message} />
    </div>
  );
};

// ─── Settings Panel ────────────────────────────────────
const SettingsPanel = () => {
  const { changePassword, isUpdating } = useUserStore();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (formData) => {
    const result = await changePassword(
      formData.currentPassword,
      formData.newPassword,
    );

    if (result.success) {
      toast.success("Password changed successfully!");
      reset();
    } else {
      result.errors?.forEach(({ field, message }) => {
        setError(field, { message });
      });
      if (!result.errors?.length) {
        toast.error("Failed to change password");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Change Password Card */}
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
          <ShieldCheck size={18} className="text-reddit-orange" />
          <h3 className="font-bold text-gray-900">Change Password</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            register={register}
            error={errors.currentPassword}
            placeholder="Your current password"
          />
          <PasswordField
            label="New Password"
            name="newPassword"
            register={register}
            error={errors.newPassword}
            placeholder="At least 6 characters"
          />
          <PasswordField
            label="Confirm New Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
            placeholder="Repeat your new password"
          />

          <div className="pt-1">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary flex items-center gap-2"
            >
              {isUpdating ? (
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
                  Updating...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info Card */}
      <div className="bg-white border border-gray-200 rounded-md p-5">
        <h3 className="font-bold text-gray-900 mb-3">Account Info</h3>
        <div className="space-y-2 text-sm text-gray-500">
          <p>🔒 Your email is private and not shown to other users.</p>
          <p>👤 Your username cannot be changed after account creation.</p>
          <p>
            🛡️ Passwords are hashed with bcrypt and never stored in plain text.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
