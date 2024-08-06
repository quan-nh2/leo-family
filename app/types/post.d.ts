export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  tags: string[];
  thumbnail: string;
  updatedAt?: Date;
  deletedAt?: Date;
};
