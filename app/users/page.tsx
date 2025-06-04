"use client";

import { useEffect, useState } from "react";
import { UserApiType } from "@/app/api/users/route";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<UserApiType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
        <Link href="/users/add" className="btn">Add User</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {users.map((user) => (
          <Link key={user.id} href={`/users/${user.id}`} className="card flex flex-col items-center hover:shadow-xl transition-shadow">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.displayName || user.username}
                className="w-20 h-20 rounded-full object-cover border mb-3"
              />
            ) : (
              <span className="inline-block w-20 h-20 rounded-full bg-gray-200 mb-3" />
            )}
            <div className="text-lg font-bold text-gray-800 mb-1">{user.displayName || user.username}</div>
            <div className="text-gray-500 text-sm mb-1">{user.email}</div>
            <div className="flex gap-2 flex-wrap justify-center">
              {(user.roles || []).map((role) => (
                <span key={role} className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-semibold">{role}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
