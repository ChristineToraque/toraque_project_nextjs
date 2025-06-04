"use client";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto card mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <a href="/categories/add" className="btn">Add Category</a>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : categories.length === 0 ? (
        <div>No categories found.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map(cat => (
            <li key={cat.id} className="py-3 flex items-center justify-between">
              <span className="font-medium text-gray-800">{cat.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
