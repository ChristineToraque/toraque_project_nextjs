"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserApiType } from "@/app/api/users/route";
import { Category } from "@/types/category";

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [users, setUsers] = useState<UserApiType[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/users").then((res) => res.json()).then(setUsers);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (content.trim().length < 50) {
      setError("Content must be at least 50 characters.");
      return;
    }
    if (!authorId) {
      setError("Author is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, authorId, coverImageUrl, tags, categoryId: selectedCategory }),
      });
      if (!res.ok) throw new Error("Failed to add blog post");
      router.push("/blog");
    } catch {
      setError("Failed to add blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto card mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Blog Post</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            className="w-full min-h-[120px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Author</label>
          <select
            className="w-full"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select author</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName || u.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Cover Image URL</label>
          <input
            className="w-full"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            className="w-full"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(
                e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
              )
            }
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="btn w-full mt-2"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}
