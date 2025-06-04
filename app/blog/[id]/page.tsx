"use client";

import { useEffect, useState } from "react";
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
				{(post.tags || []).map((tag) => (
					<span
						key={tag}
						className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="text-gray-700 text-lg whitespace-pre-line leading-relaxed">
				{post.content}
			</div>
		</div>
	);
}
