export interface ICategoriesResponse {
  message:    string;
  metadata:   Metadata;
  categories: Category[];
}

export interface Category {
  _id:           string;
  name:          string;
  slug:          string;
  image:         string;
  createdAt:     Date;
  updatedAt:     Date;
  isSuperAdmin:  boolean;
  productsCount: number;
}

export interface Metadata {
  currentPage: number;
  limit:       number;
  totalPages:  number;
  totalItems:  number;
}
