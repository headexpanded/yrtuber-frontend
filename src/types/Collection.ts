import { type Tag } from 'src/types/Tag';

export type Collection = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  description?: string;
  cover_image?: string;
  layout: string;
  is_public: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  video_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    profile: {
      username: string;
      avatar: string;
      is_verified: boolean
    };
  };
  tags?: Tag[];
  videos?: {
    id: number;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    duration: number;
    view_count: number;
    like_count: number;
    created_at: string;
    updated_at: string;
  }[];
  is_liked: boolean;
};
