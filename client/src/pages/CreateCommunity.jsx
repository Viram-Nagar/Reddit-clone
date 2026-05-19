import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import useCommunityStore from "../store/communityStore";
import { createCommunitySchema } from "../schemas/community.schema";
import FormError from "../components/ui/FormError";
import { Eye } from "lucide-react";

const CreateCommunity = () => {
  const { createCommunity, isLoading } = useCommunityStore();
  const navigate = useNavigate();
  const [namePreview, setNamePreview] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createCommunitySchema) });

  const watchName = watch("name", "");
  const watchDescription = watch("description", "");

  const onSubmit = async (formData) => {
    const result = await createCommunity(formData.name, formData.description);

    if (result.success) {
      toast.success(`r/${formData.name} created! 🎉`);
      navigate(`/r/${formData.name.toLowerCase()}`);
    } else {
      result.errors?.forEach(({ field, message }) => {
        setError(field, { message });
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-md p-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Create a Community
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Build a home for your interests
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">
              Community Name
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Community names including capitalization cannot be changed.
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                r/
              </span>
              <input
                {...register("name")}
                type="text"
                placeholder="mycommunity"
                className={`input pl-7 ${errors.name ? "border-red-400" : ""}`}
                maxLength={21}
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              <FormError message={errors.name?.message} />
              <span
                className={`text-xs ml-auto ${watchName.length > 18 ? "text-red-400" : "text-gray-400"}`}
              >
                {21 - (watchName?.length || 0)} characters remaining
              </span>
            </div>

            {/* Live preview */}
            {watchName && (
              <div className="mt-2 flex items-center gap-1.5 text-sm text-reddit-blue bg-blue-50 px-3 py-2 rounded">
                <Eye size={14} />
                Preview: <strong>r/{watchName.toLowerCase()}</strong>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-900 mb-1">
              Description{" "}
              <span className="text-gray-400 font-normal text-sm">
                (optional)
              </span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tell people what your community is about.
            </p>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="This community is about..."
              className={`input resize-none ${errors.description ? "border-red-400" : ""}`}
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              <FormError message={errors.description?.message} />
              <span className="text-xs text-gray-400 ml-auto">
                {500 - (watchDescription?.length || 0)} characters remaining
              </span>
            </div>
          </div>

          {/* Community Type — visual only for MVP */}
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Community Type
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "public",
                  label: "Public",
                  desc: "Anyone can view and post",
                  icon: "🌍",
                },
                {
                  value: "private",
                  label: "Private",
                  desc: "Only approved members",
                  icon: "🔒",
                  disabled: true,
                },
              ].map(({ value, label, desc, icon, disabled }) => (
                <label
                  key={value}
                  className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  } ${value === "public" ? "border-reddit-orange bg-orange-50" : "border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    defaultChecked={value === "public"}
                    disabled={disabled}
                    className="mt-0.5 accent-reddit-orange"
                  />
                  <div>
                    <div className="font-medium text-sm">
                      {icon} {label}
                      {disabled && (
                        <span className="text-xs text-gray-400 ml-2">
                          (Coming soon)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
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
                  Creating...
                </span>
              ) : (
                "Create Community"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
