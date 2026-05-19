import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import usePostStore from "../store/postStore";
import useCommunityStore from "../store/communityStore";
import PostForm from "../components/posts/PostForm";

const CreatePost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { createPost, isSubmitting } = usePostStore();
  const { communities, currentCommunity, fetchAllCommunities, fetchCommunity } =
    useCommunityStore();

  useEffect(() => {
    if (slug) fetchCommunity(slug);
    else fetchAllCommunities();
  }, [slug]);

  const handleSubmit = async (formData) => {
    const result = await createPost(formData);

    if (result.success) {
      toast.success("Post created! 🎉");
      navigate(`/post/${result.post.id}`);
    } else {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        {slug ? `Post to r/${slug}` : "Create a Post"}
      </h1>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <PostForm
          communities={communities}
          defaultCommunityId={currentCommunity?.id}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default CreatePost;
