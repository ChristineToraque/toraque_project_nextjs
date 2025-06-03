"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/Category";

export default function AddCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add category.");
        return;
      }
      router.push("/categories");
    } catch {
      setError("Network error. Could not add category.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Add Category</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category Name"
          className="border rounded px-3 py-2"
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors">
          Add Category
        </button>
      </form>
    </div>
  );
}
