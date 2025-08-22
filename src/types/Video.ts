// Video-related TypeScript types

export type Video = {
  id: number;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  channel_name: string | null;
  channel_id: string | null;
  duration: number | null;
  published_at: string | null;
  view_count: number | null;
  like_count: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  collections?: Collection[];
  pivot?: {
    position: number;
    curator_notes: string | null;
  };
};

export type YouTubeSearchResult = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  channel_name: string;
  channel_id: string;
  duration: number;
  published_at: string;
  view_count: number;
  like_count: number;
};

export type YouTubeSearchResponse = {
  query: string;
  results: YouTubeSearchResult[];
  count: number;
};

export type YouTubeValidationResponse = {
  valid: boolean;
  youtube_id?: string;
  is_url?: boolean;
  exists_on_youtube?: boolean;
  message: string;
};

export type CreateVideoData = {
  youtube_id: string;
  title: string;
  description?: string;
  thumbnail_url: string;
  channel_name: string;
  channel_id: string;
  duration?: number;
  published_at?: string;
  view_count?: number;
  like_count?: number;
  metadata?: Record<string, unknown>;
};

export type CreateEnhancedVideoData = {
  youtube_id: string;
  auto_fetch_metadata?: boolean;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  channel_name?: string;
  channel_id?: string;
  duration?: number;
  published_at?: string;
  view_count?: number;
  like_count?: number;
  metadata?: Record<string, unknown>;
};

export type UpdateVideoData = {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  channel_name?: string;
  channel_id?: string;
  duration?: number;
  published_at?: string;
  view_count?: number;
  like_count?: number;
  metadata?: Record<string, unknown>;
};

export type AddVideoToCollectionData = {
  video_id: number;
  position?: number;
  curator_notes?: string;
};

export type UpdateVideoInCollectionData = {
  position?: number;
  curator_notes?: string;
};

export type VideoResponse = {
  video: Video;
  message?: string;
};

export type VideosResponse = {
  data: Video[];
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

export type Collection = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  layout: 'grid' | 'list' | 'carousel' | 'magazine';
  is_public: boolean;
  is_published: boolean;
  video_count: number;
  created_at: string;
  updated_at: string;
};
