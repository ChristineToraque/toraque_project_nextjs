"use client";

import { useEffect, useState, useRef } from "react";
import { BlogPost } from "@/types/blog-post";
import { UserApiType } from "@/app/api/users/route";

export default function AddCommentPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<UserApiType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<{ postId: string; userId: string; content: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const commentFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch("/api/blog"),
          fetch("/api/users"),
        ]);
        if (!postsRes.ok) throw new Error("Failed to fetch blog posts");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        setPosts(await postsRes.json());
        setUsers(await usersRes.json());
      } catch (err) {
        setError("Could not load posts or users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUserId || !selectedPostId || !commentContent.trim()) return;
    setComments([
      ...comments,
      {
        postId: selectedPostId,
        userId: selectedUserId,
        content: commentContent,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentContent("");
    if (commentFormRef.current) commentFormRef.current.reset();
  }

  function getUserName(userId: string) {
    const user = users.find((u) => u.id === userId);
    return user ? user.displayName || user.username : "Unknown";
  }
  function getPostTitle(postId: string) {
    const post = posts.find((p) => p.id === postId);
    return post ? post.title : "Unknown Post";
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto card mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Add a Comment</h1>
      <form ref={commentFormRef} onSubmit={handleAddComment} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">User</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">Select user</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.displayName || u.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Post</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={selectedPostId}
            onChange={e => setSelectedPostId(e.target.value)}
            required
          >
            <option value="">Select post</option>
            {posts.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            className="w-full border rounded px-2 py-1"
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Comment</button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <div className="text-gray-500">No comments yet.</div>
        ) : (
          <ul className="space-y-3">
            {comments.map((c, i) => (
              <li key={i} className="border rounded p-3">
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">{getUserName(c.userId)}</span>
                  <span className="mx-2 text-gray-400">on</span>
                  <span className="font-semibold">{getPostTitle(c.postId)}</span>
                  <span className="mx-2 text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div>{c.content}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
