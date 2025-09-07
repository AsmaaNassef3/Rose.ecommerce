
export interface getBestsellerResponse {
    message:    string;
    bestSeller: BestSeller[];
}

export interface BestSeller {
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
    sold:               number;
    id:                 string;
    discount?:          number;
}
