export type Creator = {
  id: number;
  profile: {
    avatar: string;
    follower_count: number;
    following_count: number;
    is_verified: boolean;
    username: string;
    bio: string;
  };
}
