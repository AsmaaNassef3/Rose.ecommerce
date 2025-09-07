
export interface Cartitems {
    message:        string;
    numOfCartItems: number;
    cart:           Cart;
}

export interface Cart {
    _id:            string;
    user:           string;
    cartItems:      CartItem[];
    appliedCoupons: any[];
    totalPrice:     number;
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
}

export interface CartItem {
    product:  Product;
    price:    number;
    quantity: number;
    _id:      string;
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
    sold:               number;
    id:                 string;
}
