export type Video = {
  id: number;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  channel_name: string;
  channel_id: string;
  duration: number | null; // seconds
  published_at: string; // ISO date string
  view_count: number;
  like_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  collections?: {
    id: number;
    title: string;
    slug: string;
    pivot: {
      position: number;
      curator_notes: string | null;
    };
  }[];

  is_liked?: boolean;

  embed_url: string;
  watch_url: string;
};
