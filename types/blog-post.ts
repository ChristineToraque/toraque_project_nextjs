export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  coverImageUrl?: string;
  categoryId?: string;
}
