export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount: number;
  imgCover: string;
  quantity: number;
  sold: number;
  category: string;
  occasion: string;
   rateAvg: number;
}

export interface ProductsResponse {
  message: string;
  metadata: {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalItems: number;
  };
  products: Product[];
}
