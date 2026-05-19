import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Camera,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  Edit2,
  X,
  Check,
} from "lucide-react";
import { formatFullDate } from "../../utils/formatDate";
import useAuthStore from "../../store/authStore";
import useUserStore from "../../store/userStore";
import toast from "react-hot-toast";
import useImageUpload from "../../hooks/useImageUpload";

// ─── Edit Profile Schema ───────────────────────────────
const editProfileSchema = z.object({
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// ─── Stat Badge ────────────────────────────────────────
const StatBadge = ({ icon, value, label }) => (
  <div className="flex flex-col items-center px-4 py-2 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-1 text-reddit-orange mb-0.5">
      {icon}
      <span className="font-bold text-gray-900 text-lg">
        {value?.toLocaleString()}
      </span>
    </div>
    <span className="text-xs text-gray-500">{label}</span>
  </div>
);

// ─── Profile Header ────────────────────────────────────
const ProfileHeader = ({ profile }) => {
  const { user, login } = useAuthStore();
  const { updateProfile, isUpdating } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const { uploadAvatar, isUploading: isUploadingAvatar } = useImageUpload();
  const avatarInputRef = useRef(null);

  const isOwner = user?.id === profile.id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: profile.bio || "",
      avatar: profile.avatar || "",
    },
  });

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const updatedUser = await uploadAvatar(file);
    if (updatedUser) {
      // Update local profile state
      toast.success("Avatar updated!");
    }
  };

  const watchBio = watch("bio", profile.bio || "");

  const onSubmit = async (formData) => {
    const result = await updateProfile({
      bio: formData.bio || null,
      avatar: formData.avatar || null,
    });

    if (result.success) {
      toast.success("Profile updated!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-4">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-reddit-orange via-orange-400 to-yellow-400 relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
          }}
        />
      </div>

      <div className="px-6 pb-5">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-br from-reddit-orange to-orange-400 flex items-center justify-center shadow-md">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {profile.username[0].toUpperCase()}
                </span>
              )}
            </div>
            {isOwner && !isEditing && (
              // <button
              //   onClick={() => setIsEditing(true)}
              //   className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
              //   title="Edit profile"
              // >
              //   <Camera size={12} className="text-white" />
              // </button>

              <>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors disabled:opacity-50"
                  title="Change avatar"
                >
                  {isUploadingAvatar ? (
                    <svg
                      className="animate-spin h-3 w-3 text-white"
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
                  ) : (
                    <Camera size={12} className="text-white" />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Edit / Save buttons */}
          {isOwner && (
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="btn-ghost text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating}
                    className="btn-primary text-sm flex items-center gap-1.5"
                  >
                    {isUpdating ? (
                      <>
                        <svg
                          className="animate-spin h-3.5 w-3.5"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Save
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary text-sm flex items-center gap-1.5"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* Username */}
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">
          u/{profile.username}
        </h1>

        {/* Joined date */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Calendar size={12} />
          Joined {formatFullDate(profile.createdAt)}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <StatBadge
            icon={<Award size={15} />}
            value={profile.karma}
            label="Karma"
          />
          <StatBadge
            icon={<FileText size={15} />}
            value={profile._count.posts}
            label="Posts"
          />
          <StatBadge
            icon={<MessageSquare size={15} />}
            value={profile._count.comments}
            label="Comments"
          />
        </div>

        {/* Bio section */}
        {isEditing ? (
          <div className="space-y-3">
            {/* Bio edit */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Bio
              </label>
              <textarea
                {...register("bio")}
                rows={3}
                placeholder="Tell the community about yourself..."
                className="input resize-none text-sm"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && (
                  <p className="text-red-500 text-xs">{errors.bio.message}</p>
                )}
                <span className="text-xs text-gray-400 ml-auto">
                  {200 - (watchBio?.length || 0)} chars remaining
                </span>
              </div>
            </div>

            {/* Avatar URL edit */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Avatar URL
              </label>
              <input
                {...register("avatar")}
                type="url"
                placeholder="https://example.com/avatar.jpg"
                className="input text-sm"
              />
              {errors.avatar && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.avatar.message}
                </p>
              )}
            </div>
          </div>
        ) : profile.bio ? (
          <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
        ) : isOwner ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-400 hover:text-reddit-orange transition-colors italic"
          >
            + Add a bio to tell people about yourself
          </button>
        ) : (
          <p className="text-sm text-gray-400 italic">
            This user hasn't added a bio yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
