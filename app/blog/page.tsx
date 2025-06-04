"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog-post";
import { UserApiType } from "@/app/api/users/route";
import { Category } from "@/types/category";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<UserApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, usersRes, categoriesRes] = await Promise.all([
          fetch("/api/blog"),
          fetch("/api/users"),
          fetch("/api/categories"),
        ]);
        if (!postsRes.ok) throw new Error("Failed to fetch blog posts");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");

        const postsData = await postsRes.json();
        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();

        setPosts(postsData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Could not load blog posts or users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getAuthorName = (authorId: string) => {
    const user = users.find((u) => u.id === authorId);
    return user ? user.displayName || user.username : "Unknown";
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  if (loading) return <div className="p-8">Loading blog posts...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Blog</h1>
        <Link href="/blog/add" className="btn">
          Add Post
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="card flex flex-col gap-3 hover:shadow-xl transition-shadow" >
            {post.coverImageUrl ? (
              <img
                src={post.coverImageUrl}
                alt="cover"
                className="w-full h-40 object-cover rounded-lg mb-2" />
            ) : (
              <div className="w-full h-40 bg-indigo-100 rounded-lg mb-2 flex items-center justify-center text-indigo-400 text-4xl font-bold">
                📝
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {post.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>By {getAuthorName(post.authorId)}</span>
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              {post.categoryId && getCategoryName(post.categoryId) && (
                <>
                  <span className="font-semibold">Category:</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {getCategoryName(post.categoryId)}
                  </span>
                </>
              )}
              {post.categoryId && getCategoryName(post.categoryId) && (post.tags || []).length > 0 && (
                <span>|</span>
              )}
              {(post.tags || []).length > 0 && (
                <>
                  <span className="font-semibold">Tags:</span>
                  <div className="flex gap-1 flex-wrap">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
                      {getCategoryName(post.categoryId)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="text-gray-600 text-sm line-clamp-3">
              {post.content.slice(0, 100)}...
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
