// User-related TypeScript types

export type User = {
  id: number;
  username: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
};

export type UserProfile = {
  id: number;
  user_id: number;
  username: string;
  bio: string | null;
  website: string | null;
  social_links: SocialLinks | null;
  created_at: string;
  updated_at: string;
};

export type SocialLinks = {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  github?: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type UpdateProfileData = {
  username?: string;
  bio?: string;
  website?: string;
  social_links: SocialLinks;
};

export type UpdatePasswordData = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type AuthResponse = {
  user: User;
  message?: string;
};

export type ApiError = {
  message: string;
  errors?: Record<string, string[]>;
};
