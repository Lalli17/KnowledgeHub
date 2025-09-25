export interface ArticleMetrics {
  id: number;
  title: string;
  url: string;
  description: string;
  postedBy: string;
  categoryName: string;
  status?: string;
  DateSubmitted?: Date;
  updatedAt?: Date;
}
