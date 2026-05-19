import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AlignLeft, Image, Link as LinkIcon } from "lucide-react";
import { createPostSchema } from "../../schemas/post.schema";
import FormError from "../ui/FormError";
import ImageUpload from "../upload/ImageUpload";

const POST_TYPES = [
  { value: "text", label: "Text", icon: <AlignLeft size={15} /> },

  { value: "link", label: "Link", icon: <LinkIcon size={15} /> },
];

const PostForm = ({
  communities,
  defaultCommunityId,
  onSubmit,
  isSubmitting,
}) => {
  const [activeType, setActiveType] = useState("text");
  const [imagePublicId, setImagePublicId] = useState(""); // ← Day 11: track Cloudinary publicId

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: "text",
      communityId: defaultCommunityId || "",
    },
  });

  const watchTitle = watch("title", "");

  const handleTypeChange = (type) => {
    setActiveType(type);
    setValue("type", type);
    // Clear image data when switching away from image tab
    if (type !== "image") {
      setValue("imageUrl", "");
      setImagePublicId("");
    }
  };

  // ── Include publicId when submitting ──────────────────
  const handleFormSubmit = (data) => {
    onSubmit({ ...data, imagePublicId });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-0">
      {/* ── Post Type Tabs ───────────────────────────── */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {POST_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => handleTypeChange(value)}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-all flex-1 justify-center ${
              activeType === value
                ? "border-[#FF4500] text-[#FF4500] bg-orange-50 dark:bg-orange-900/10"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {/* ── Community Selector ───────────────────────── */}
        {!defaultCommunityId && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              Community
            </label>
            <select
              {...register("communityId")}
              className={`input ${errors.communityId ? "border-red-400" : ""}`}
            >
              <option value="">Choose a community</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  r/{c.name}
                </option>
              ))}
            </select>
            <FormError message={errors.communityId?.message} />
          </div>
        )}

        {/* ── Title ────────────────────────────────────── */}
        <div>
          <div className="relative">
            <input
              {...register("title")}
              type="text"
              placeholder="Title"
              maxLength={300}
              className={`input pr-16 ${errors.title ? "border-red-400" : ""}`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {300 - (watchTitle?.length || 0)}
            </span>
          </div>
          <FormError message={errors.title?.message} />
        </div>

        {/* ── Text Tab ─────────────────────────────────── */}
        {activeType === "text" && (
          <div>
            <textarea
              {...register("content")}
              rows={6}
              placeholder="Text (optional)"
              className={`input resize-none ${
                errors.content ? "border-red-400" : ""
              }`}
            />
            <FormError message={errors.content?.message} />
          </div>
        )}

        {/* ── Link Tab ──────────────────────────────────── */}
        {activeType === "link" && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">
              URL
            </label>
            <input
              {...register("imageUrl")}
              type="url"
              placeholder="https://example.com"
              className={`input ${errors.imageUrl ? "border-red-400" : ""}`}
            />
            <FormError message={errors.imageUrl?.message} />
          </div>
        )}

        {/* ── Submit Buttons ────────────────────────────── */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary min-w-[100px]"
          >
            {isSubmitting ? (
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
                Posting...
              </span>
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { AlignLeft, Image, Link as LinkIcon } from "lucide-react";
// import { createPostSchema } from "../../schemas/post.schema";
// import FormError from "../ui/FormError";

// const POST_TYPES = [
//   { value: "text", label: "Text", icon: <AlignLeft size={15} /> },
//   { value: "image", label: "Image", icon: <Image size={15} /> },
//   { value: "link", label: "Link", icon: <LinkIcon size={15} /> },
// ];

// const PostForm = ({
//   communities,
//   defaultCommunityId,
//   onSubmit,
//   isSubmitting,
// }) => {
//   const [activeType, setActiveType] = useState("text");

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(createPostSchema),
//     defaultValues: {
//       type: "text",
//       communityId: defaultCommunityId || "",
//     },
//   });

//   const watchTitle = watch("title", "");

//   const handleTypeChange = (type) => {
//     setActiveType(type);
//     setValue("type", type);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//       {/* Post Type Tabs */}
//       <div className="flex border-b border-gray-200">
//         {POST_TYPES.map(({ value, label, icon }) => (
//           <button
//             key={value}
//             type="button"
//             onClick={() => handleTypeChange(value)}
//             className={`flex items-center gap-1.5 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
//               activeType === value
//                 ? "border-black text-black"
//                 : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//             }`}
//           >
//             {icon} {label}
//           </button>
//         ))}
//       </div>

//       <div className="p-4 space-y-4">
//         {/* Community Selector */}
//         {!defaultCommunityId && (
//           <div>
//             <select
//               {...register("communityId")}
//               className={`input ${errors.communityId ? "border-red-400" : ""}`}
//             >
//               <option value="">Choose a community</option>
//               {communities.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   r/{c.name}
//                 </option>
//               ))}
//             </select>
//             <FormError message={errors.communityId?.message} />
//           </div>
//         )}

//         {/* Title */}
//         <div>
//           <div className="relative">
//             <input
//               {...register("title")}
//               type="text"
//               placeholder="Title"
//               maxLength={300}
//               className={`input pr-16 ${errors.title ? "border-red-400" : ""}`}
//             />
//             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
//               {300 - (watchTitle?.length || 0)}
//             </span>
//           </div>
//           <FormError message={errors.title?.message} />
//         </div>

//         {/* Dynamic Content Field */}
//         {activeType === "text" && (
//           <div>
//             <textarea
//               {...register("content")}
//               rows={6}
//               placeholder="Text (optional)"
//               className={`input resize-none ${errors.content ? "border-red-400" : ""}`}
//             />
//             <FormError message={errors.content?.message} />
//           </div>
//         )}

//         {activeType === "image" && (
//           <div>
//             <input
//               {...register("imageUrl")}
//               type="url"
//               placeholder="Paste image URL (https://...)"
//               className={`input ${errors.imageUrl ? "border-red-400" : ""}`}
//             />
//             <FormError message={errors.imageUrl?.message} />
//             <p className="text-xs text-gray-400 mt-1">
//               Paste a direct image URL. Image upload coming soon!
//             </p>
//           </div>
//         )}

//         {activeType === "link" && (
//           <div>
//             <input
//               {...register("imageUrl")}
//               type="url"
//               placeholder="URL (https://...)"
//               className={`input ${errors.imageUrl ? "border-red-400" : ""}`}
//             />
//             <FormError message={errors.imageUrl?.message} />
//           </div>
//         )}

//         {/* Submit */}
//         <div className="flex justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className="btn-secondary"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="btn-primary min-w-[100px]"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg
//                   className="animate-spin h-4 w-4"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v8z"
//                   />
//                 </svg>
//                 Posting...
//               </span>
//             ) : (
//               "Post"
//             )}
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PostForm;
// {/* ── Image Tab (Day 11 — Cloudinary Upload) ───── */}
// {activeType === "image" && (
//   <div>
//     <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
//       Image
//     </label>

//     {/* Hidden fields to store imageUrl + publicId in form */}
//     <input type="hidden" {...register("imageUrl")} />
//     <input
//       type="hidden"
//       {...register("imagePublicId")}
//       value={imagePublicId}
//     />

//     {/* Drag & drop / URL uploader component */}
//     <ImageUpload
//       onImageChange={(url) => {
//         setValue("imageUrl", url);
//         setValue("type", "image");
//       }}
//       onPublicIdChange={(id) => {
//         setImagePublicId(id);
//         setValue("imagePublicId", id);
//       }}
//     />

//     {errors.imageUrl && (
//       <p className="text-red-500 text-xs mt-1">
//         {errors.imageUrl.message}
//       </p>
//     )}
//   </div>
// )}
//  { value: "image", label: "Image", icon: <Image size={15} /> },
