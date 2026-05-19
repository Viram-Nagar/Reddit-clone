import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import useAuthStore from "../../store/authStore";
import useCommentStore from "../../store/commentStore";
import { createCommentSchema } from "../../schemas/comment.schema";
import FormError from "../ui/FormError";
import toast from "react-hot-toast";

// ─── New Comment Form ─────────────────────────────────
export const NewCommentForm = ({ postId }) => {
  const { user } = useAuthStore();
  const { addComment, isSubmitting } = useCommentStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createCommentSchema) });

  const content = watch("content", "");

  const onSubmit = async (formData) => {
    const result = await addComment(postId, formData.content);
    if (result.success) {
      reset();
      toast.success("Comment added!");
    } else {
      toast.error("Failed to add comment");
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center mb-6">
        <p className="text-sm text-gray-600 mb-3">
          Log in or sign up to leave a comment
        </p>
        <div className="flex justify-center gap-2">
          <Link to="/login">
            <button className="btn-secondary text-xs">Log In</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary text-xs">Sign Up</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <p className="text-xs text-gray-500 mb-2">
        Commenting as{" "}
        <Link
          to={`/u/${user.username}`}
          className="font-semibold text-reddit-blue hover:underline"
        >
          u/{user.username}
        </Link>
      </p>

      <div className="border border-gray-300 rounded overflow-hidden focus-within:border-reddit-blue focus-within:ring-1 focus-within:ring-reddit-blue transition-all">
        <textarea
          {...register("content")}
          rows={4}
          placeholder="What are your thoughts?"
          className="w-full px-3 py-2 text-sm resize-none focus:outline-none"
        />

        {/* Form footer */}
        <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-t border-gray-200">
          <span
            className={`text-xs ${
              content.length > 9500 ? "text-red-400" : "text-gray-400"
            }`}
          >
            {content.length > 0 && `${10000 - content.length} chars remaining`}
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="btn-primary text-xs py-1.5 px-4 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <svg
                  className="animate-spin h-3 w-3"
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
                Posting...
              </span>
            ) : (
              "Comment"
            )}
          </button>
        </div>
      </div>

      {errors.content && <FormError message={errors.content.message} />}
    </form>
  );
};

// ─── Edit Comment Form ────────────────────────────────
export const EditCommentForm = ({ comment }) => {
  const { editComment, cancelEditing, isSubmitting } = useCommentStore();
  const textareaRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: comment.content },
  });

  const content = watch("content", comment.content);

  // Auto-focus and move cursor to end
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, []);

  const onSubmit = async (formData) => {
    if (formData.content === comment.content) {
      cancelEditing();
      return;
    }
    const result = await editComment(comment.id, formData.content);
    if (result.success) toast.success("Comment updated");
    else toast.error("Failed to update comment");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="border border-reddit-blue rounded overflow-hidden ring-1 ring-reddit-blue">
        <textarea
          {...register("content")}
          ref={(e) => {
            register("content").ref(e);
            textareaRef.current = e;
          }}
          rows={4}
          className="w-full px-3 py-2 text-sm resize-none focus:outline-none"
        />

        <div className="bg-gray-50 px-3 py-2 flex items-center justify-end gap-2 border-t border-gray-200">
          <button
            type="button"
            onClick={cancelEditing}
            className="btn-ghost text-xs py-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="btn-primary text-xs py-1.5 px-4 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      {errors.content && <FormError message={errors.content.message} />}
    </form>
  );
};
