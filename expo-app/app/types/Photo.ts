import { File } from './File';
import { FirebaseTime } from './FirebaseTime';
import { User } from './User';

export type Photo = {
  placeId: number;
  user: User;
  views: number;
  createdAt: FirebaseTime;
  id: string;
} & File;
