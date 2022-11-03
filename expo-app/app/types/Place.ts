import { Address } from './Address';
import { Category } from './Category';
import { File } from './File';
import { Post } from './Post';

export type Place = {
  id: number;
  name: string;
  title: string;
  cover: File;
  square: File;
  description: string;
  rating: number;
  address: Address;
  posts: Post[];
  categories: Category[];
  lat: number;
  lng: number;
  category: Category;
  site: string;
  theme: 'light' | 'dark';
  views: number;
  categoryId: number;
  photos: string[];
};
