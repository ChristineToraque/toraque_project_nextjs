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
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<Partial<Record<keyof typeof form, boolean>>>({});

  const handleChange = <K extends keyof typeof form>(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleRolesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, roles: e.target.value.split(",").map((r) => r.trim()) }));
    setTouched((prev) => ({ ...prev, roles: true }));
  };

  const getFieldError = (field: keyof typeof form): string | null => {
    if (!touched[field]) return null;
    if (field === "username" && (!form.username || form.username.length < 3)) {
      return "Username must be at least 3 characters.";
    }
    if (field === "password" && (!form.password || form.password.length < 6)) {
      return "Password must be at least 6 characters.";
    }
    if (
      field === "email" &&
      (!form.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
    ) {
      return "A valid email is required.";
    }
    return null;
  };

  const validate = (data: typeof form) => {
    if (!data.username || data.username.length < 3) {
      return "Username is required and must be at least 3 characters.";
    }
    if (!data.password || data.password.length < 6) {
      return "Password is required and must be at least 6 characters.";
    }
    if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return "A valid email is required.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Failed to add user");
      }
      router.push("/users");
    } catch (err) {
      setError("Failed to add user");
    }
  };

  return (
    <div className="max-w-lg mx-auto card mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Add User</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full"
            required
          />
          {getFieldError("username") && <div className="text-red-500 text-xs mt-1">{getFieldError("username")}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full"
            required
          />
          {getFieldError("password") && <div className="text-red-500 text-xs mt-1">{getFieldError("password")}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full"
            required
          />
          {getFieldError("email") && <div className="text-red-500 text-xs mt-1">{getFieldError("email")}</div>}
        </div>
        <div>
          <label className="block mb-1 font-medium">Display Name</label>
          <input
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Profile Image URL</label>
          <input
            name="profileImageUrl"
            value={form.profileImageUrl}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Roles (comma separated)</label>
          <input
            name="roles"
            value={(form.roles || []).join(", ")}
            onChange={handleRolesChange}
            className="w-full"
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" className="btn w-full mt-2">Add User</button>
      </form>
    </div>
  );
}
