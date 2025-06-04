"use client";

import { useEffect, useState, useRef } from "react";
import { BlogPost } from "@/types/blog-post";
import { UserApiType } from "@/app/api/users/route";
import { Category } from "@/types/category";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
	const params = useParams<{ id: string }>();
	const [post, setPost] = useState<BlogPost | null>(null);
	const [users, setUsers] = useState<UserApiType[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [comments, setComments] = useState<{ postId: string; userId: string; content: string; createdAt: string }[]>([]);
	const [commentContent, setCommentContent] = useState("");
	const [selectedUserId, setSelectedUserId] = useState("");
	const commentFormRef = useRef<HTMLFormElement>(null);

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
				const postsData: BlogPost[] = await postsRes.json();
				const usersData: UserApiType[] = await usersRes.json();
				const categoriesData: Category[] = await categoriesRes.json();
				const foundPost = postsData.find((p) => p.id === params.id);
				setPost(foundPost || null);
				setUsers(usersData);
				setCategories(categoriesData);
			} catch (err) {
				setError("Could not load blog post or users");
			} finally {
				setLoading(false);
			}
		}
		if (params?.id) fetchData();
	}, [params?.id]);

	function getAuthorName(authorId: string) {
		const user = users.find((u) => u.id === authorId);
		return user ? user.displayName || user.username : "Unknown";
	}

	function handleAddComment(e: React.FormEvent) {
		e.preventDefault();
		if (!selectedUserId || !post || !commentContent.trim()) return;
		setComments([
			...comments,
			{
				postId: post.id,
				userId: selectedUserId,
				content: commentContent,
				createdAt: new Date().toISOString(),
			},
		]);
		setCommentContent("");
		if (commentFormRef.current) commentFormRef.current.reset();
	}

	if (loading) return <div className="p-8">Loading blog post...</div>;
	if (error) return <div className="p-8 text-red-600">{error}</div>;
	if (!post) return notFound();

	return (
		<div className="max-w-2xl mx-auto card mt-10">
			{post.coverImageUrl ? (
				<img
					src={post.coverImageUrl}
					alt="cover"
					className="w-full h-64 object-cover rounded-lg mb-6"
				/>
			) : (
				<div className="w-full h-64 bg-indigo-100 rounded-lg mb-6 flex items-center justify-center text-indigo-400 text-5xl font-bold">
					📝
				</div>
			)}
			<h1 className="text-3xl font-extrabold mb-2 text-gray-900">
				{post.title}
			</h1>
			<div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
				<span>{`By ${getAuthorName(post.authorId)}`}</span>
				<span>·</span>
				<span>{new Date(post.createdAt).toLocaleDateString()}</span>
			</div>
			<div className="flex gap-2 flex-wrap mb-4">
				{post.categoryId && categories.length > 0 && (
					<span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">
						{(() => {
							const cat = categories.find((c) => c.id === post.categoryId);
							return cat ? cat.name : "Uncategorized";
						})()}
					</span>
				)}
				{(post.tags && post.tags.length > 0) && (
					<>
						<span className="font-semibold text-xs text-gray-500">Tags:</span>
						{post.tags.map((tag) => (
							<span
								key={tag}
								className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold" >
								{tag}
							</span>
						))}
					</>
				)}
			</div>
			<div className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
				{post.content}
			</div>
			<div className="mt-10 border-t pt-6">
				<h2 className="text-xl font-bold mb-4">Add a Comment</h2>
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
					{comments.filter(c => c.postId === post.id).length === 0 ? (
						<div className="text-gray-500">No comments yet.</div>
					) : (
						<ul className="space-y-3">
							{comments.filter(c => c.postId === post.id).map((c, i) => (
								<li key={i} className="border rounded p-3">
									<div className="text-sm text-gray-700 mb-1">
										<span className="font-semibold">{getAuthorName(c.userId)}</span>
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
		</div>
	);
}
