export interface popularItems {
    message:  string;
    metadata: Metadata;
    products: Product[];
}

export interface Metadata {
    currentPage: number;
    totalPages:  number;
    limit:       number;
    totalItems:  number;
}

export interface Product {
    rateAvg:            number;
    rateCount:          number;
    _id:                string;
    title:              string;
    slug:               string;
    description:        string;
    imgCover:           string;
    images:             string[];
    price:              number;
    priceAfterDiscount: number;
    quantity:           number;
    category:           string;
    occasion:           string;
    createdAt:          Date;
    updatedAt:          Date;
    __v:                number;
    isSuperAdmin:       boolean;
    sold?:              number;
    id:                 string;
    discount?:          number;
}
