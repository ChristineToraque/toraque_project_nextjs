"use client";

import { useState } from "react";
import { UserInterface } from "@/types/user-interface";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<UserInterface, "id" | "createdAt" | "updatedAt">>({
    username: "",
    password: "",
    email: "",
    displayName: "",
    profileImageUrl: "",
    roles: [],
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, roles: e.target.value.split(",").map((r) => r.trim()) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.email) {
      setError("Username, password, and email are required.");
      return;
    }
    // Here you would send the data to your backend or update state
    // For now, just redirect back to /users
    router.push("/users");
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add New User</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded px-3 py-2"
          required
        />
        <input
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder="Display Name (optional)"
          className="border rounded px-3 py-2"
        />
        <input
          name="profileImageUrl"
          value={form.profileImageUrl}
          onChange={handleChange}
          placeholder="Profile Image URL (optional)"
          className="border rounded px-3 py-2"
        />
        <input
          name="roles"
          value={form.roles?.join(", ")}
          onChange={handleRolesChange}
          placeholder="Roles (comma separated, optional)"
          className="border rounded px-3 py-2"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors">
          Add User
        </button>
      </form>
    </div>
  );
}
