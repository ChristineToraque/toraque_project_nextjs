import { UserInterface } from "@/types/user-interface";

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

export default function UsersPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Avatar</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Display Name</th>
            <th className="px-4 py-2 text-left">Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.displayName || user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-block w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                )}
              </td>
              <td className="px-4 py-2 font-mono">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.displayName || "-"}</td>
              <td className="px-4 py-2">{user.roles?.join(", ") || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
