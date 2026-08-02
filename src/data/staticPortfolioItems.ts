export type Category = "images";

export interface StaticPortfolioItem {
  key: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

export const categoryLabels: Record<Category, string> = {
  images: "Imágenes",
};

export const staticPortfolioItems: Record<Category, StaticPortfolioItem[]> = {
  images: [],
};
