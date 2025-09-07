import { Product } from "../../shared/interfaces/products/productmodel";

export interface ProductsState {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  isLoading: boolean;
searchTerm: string;
  selectedCategories: string[];
     priceRange: { min: number | null; max: number | null };
  error: string | null;
}

export const initialProductsState: ProductsState = {
  products: [],
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
    searchTerm: '',
      selectedCategories: [],
     priceRange: { min: null, max: null },
};

