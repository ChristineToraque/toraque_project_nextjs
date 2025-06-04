import { BlogPost } from "@/types/blog-post";
import { notFound } from "next/navigation";

const posts: BlogPost[] = [
	{
		id: "1",
		title: "Welcome to the Blog!",
		content: "This is the first post. Edit or add more posts to get started.",
		authorId: "1",
		createdAt: "2025-06-02T00:00:00.000Z",
		updatedAt: "2025-06-02T00:00:00.000Z",
		tags: ["welcome", "intro"],
		coverImageUrl: "",
	},
];

const users: { id: string; username: string; displayName?: string }[] = [
];

function getAuthorName(authorId: string) {
	const user = users.find((u) => u.id === authorId);
	return user ? user.displayName || user.username : authorId;
}

interface BlogDetailPageProps {
	params: { id: string };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
	const post = posts.find((p) => p.id === params.id);
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
