export type Collection = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  cover_image?: string;
  is_public: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  video_count: number;
  description?: string;
  created_at: string;
  updated_at: string;
}
