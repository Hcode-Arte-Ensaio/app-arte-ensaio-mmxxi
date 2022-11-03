import { User } from './User';

export type Rate = {
  id: number;
  user: User;
  value: number;
  createdAt: string;
};
