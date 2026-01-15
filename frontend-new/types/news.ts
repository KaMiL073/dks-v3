export type News = {
  id: string;
  title: string;
  image?: string;
  status: "draft" | "published";
  date_created: string;
  category?: {
    name: string;
    slug: string;
  };
};
