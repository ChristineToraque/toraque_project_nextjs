"use client";
import { useState } from "react";
import { BlogPost } from "@/types/blog-post";
import { useRouter } from "next/navigation";

export default function AddBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>({
    title: "",
    content: "",
    authorId: "",
    tags: [],
    coverImageUrl: "",
  });
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof typeof form, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, tags: e.target.value.split(",").map((t) => t.trim()) }));
    setTouched((prev) => ({ ...prev, tags: true }));
  };

  const getFieldError = (field: keyof typeof form): string | null => {
    if (!touched[field]) return null;
    if (field === "title" && (!form.title || form.title.length < 3)) {
      return "Title must be at least 3 characters.";
    }
    if (field === "content" && (!form.content || form.content.length < 10)) {
      return "Content must be at least 10 characters.";
    }
    if (field === "authorId" && !form.authorId) {
      return "Author ID is required.";
    }
    return null;
  };

  const validate = (data: typeof form) => {
    if (!data.title || data.title.length < 3) {
      return "Title is required and must be at least 3 characters.";
    }
    if (!data.content || data.content.length < 10) {
      return "Content is required and must be at least 10 characters.";
    }
    if (!data.authorId) {
      return "Author ID is required.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, content: true, authorId: true });
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add blog post.");
        return;
      }
      router.push("/blog");
    } catch (err) {
      setError("Network error. Could not add blog post.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add Blog Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
          placeholder="Title"
          className="border rounded px-3 py-2"
          required
        />
        {getFieldError("title") && (
          <div className="text-red-600 text-xs">{getFieldError("title")}</div>
        )}
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          onBlur={() => setTouched((prev) => ({ ...prev, content: true }))}
          placeholder="Content"
          className="border rounded px-3 py-2 min-h-[120px]"
          required
        />
        {getFieldError("content") && (
          <div className="text-red-600 text-xs">{getFieldError("content")}</div>
        )}
        <input
          name="authorId"
          value={form.authorId}
          onChange={handleChange}
          onBlur={() => setTouched((prev) => ({ ...prev, authorId: true }))}
          placeholder="Author ID"
          className="border rounded px-3 py-2"
          required
        />
        {getFieldError("authorId") && (
          <div className="text-red-600 text-xs">{getFieldError("authorId")}</div>
        )}
        <input
          name="tags"
          value={form.tags?.join(", ")}
          onChange={handleTagsChange}
          placeholder="Tags (comma separated, optional)"
          className="border rounded px-3 py-2"
        />
        <input
          name="coverImageUrl"
          value={form.coverImageUrl}
          onChange={handleChange}
          placeholder="Cover Image URL (optional)"
          className="border rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors">
          Add Post
        </button>
      </form>
    </div>
  );
}
