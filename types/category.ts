export interface Category {
  id: string;
  name: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;

  // Mga optional fields
  tags?: string[];
  coverImageUrl?: string;
  categoryIds?: string[];
}
