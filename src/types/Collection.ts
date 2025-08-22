// Collection-related TypeScript types

export type Collection = {
  id: number;
  user_id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  layout: 'grid' | 'list' | 'carousel' | 'magazine';
  is_public: boolean;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  video_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    profile?: {
      username: string;
      avatar: string | null;
      is_verified: boolean;
    };
  };
  videos?: Video[];
  tags?: Tag[];
  is_liked?: boolean;
};

export type Video = {
  id: number;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  channel_name: string | null;
  published_at: string | null;
  pivot?: {
    position: number;
    curator_notes: string | null;
  };
};

export type Tag = {
  id: number;
  name: string;
  color: string;
};

export type CreateCollectionData = {
  title: string;
  description?: string;
  cover_image?: string;
  layout: 'grid' | 'list' | 'carousel' | 'magazine';
  is_public: boolean;
  is_published: boolean;
  tags?: number[];
};

export type UpdateCollectionData = {
  title?: string;
  description?: string;
  cover_image?: string;
  layout?: 'grid' | 'list' | 'carousel' | 'magazine';
  is_public?: boolean;
  is_published?: boolean;
  tags?: number[];
};

export type PublishCollectionData = {
  is_published: boolean;
};

export type CollectionResponse = {
  collection: Collection;
  message?: string;
};

export type CollectionsResponse = {
  data: Collection[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
};
