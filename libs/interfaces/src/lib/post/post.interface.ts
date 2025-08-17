import { Profile } from '../profile/profile.interface';

export interface Post {
  id: number;
  text: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: Profile;
  likesAmount: number;
  commentsAmount: number;
  isLiked: boolean;
}

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: Profile;
}
