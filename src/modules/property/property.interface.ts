export interface IPropertyQuery {
  searchTerm?: string;

  city?: string;
  district?: string;
  categoryId?: string;
  status?: string;

  minRent?: string;
  maxRent?: string;

  page?: string;
  limit?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
