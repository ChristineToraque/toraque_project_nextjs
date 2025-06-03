import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/types/Category";

export type CategoryApiType = Category;

let categories: CategoryApiType[] = [
  { id: "1", name: "General" },
  { id: "2", name: "Tech" },
];

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }
    const newCategory: CategoryApiType = {
      id: (categories.length + 1).toString(),
      name: data.name.trim(),
    };
    categories.push(newCategory);
    return NextResponse.json({ message: "Category added successfully", category: newCategory }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category. Please check server logs." }, { status: 500 });
  }
}
