import { UserInterface } from "@/types/user-interface";
import { notFound } from "next/navigation";

const users: UserInterface[] = [
	{
		id: "1",
		username: "johndoe",
		password: "********",
		email: "john@example.com",
		displayName: "John Doe",
		profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
		roles: ["user"],
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2025-06-02"),
	},
	{
		id: "2",
		username: "janedoe",
		password: "********",
		email: "jane@example.com",
		displayName: "Jane Doe",
		profileImageUrl: "https://randomuser.me/api/portraits/women/2.jpg",
		roles: ["admin"],
		createdAt: new Date("2024-02-01"),
		updatedAt: new Date("2025-06-02"),
	},
];

interface UserProfilePageProps {
	params: { id: string };
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
	const user = users.find((u) => u.id === params.id);
	if (!user) return notFound();

	return (
		<div className="max-w-lg mx-auto card mt-10 flex flex-col items-center">
			{user.profileImageUrl ? (
				<img
					src={user.profileImageUrl}
					alt={user.displayName || user.username}
					className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 mb-4 shadow-lg"
				/>
			) : (
				<span className="inline-block w-28 h-28 rounded-full bg-gray-200 mb-4" />
			)}
			<h2 className="text-2xl font-bold mb-1 text-gray-900">
				{user.displayName || user.username}
			</h2>
			<div className="text-gray-500 mb-2">@{user.username}</div>
			<div className="text-gray-600 mb-2">{user.email}</div>
			<div className="flex gap-2 flex-wrap justify-center mb-4">
				{(user.roles || []).map((role) => (
					<span
						key={role}
						className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold"
					>
						{role}
					</span>
				))}
			</div>
			<div className="text-xs text-gray-400">
				Joined: {user.createdAt?.toLocaleDateString?.() || "-"}
			</div>
		</div>
	);
}
