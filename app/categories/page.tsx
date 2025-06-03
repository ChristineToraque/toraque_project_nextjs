"use client";
import { useEffect, useState } from "react";
import { Category } from "@/types/Category";
import Link from "next/link";

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch {
        setError("Could not load categories");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="p-8">Loading categories...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/categories/add" className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors">Add Category</Link>
      </div>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800">
            <span className="font-semibold text-lg">{cat.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
