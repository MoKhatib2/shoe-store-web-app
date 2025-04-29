export interface address {
    _id: string;
    city: string;
    postCode: number;
    streetName: string;
    buildingNumber: number;
    apartmentNumber: number;
}

export interface cartItem {
    _id: string;
    shoeId: string;
    variantId: string;
    size: number;
    quantity: number;
    unitPrice: number;
}

export class User {
    constructor(
        readonly _id: string,
        readonly name: {
            first: string,
            last: string
        },
        readonly email: string,
        readonly password: String,
        public cart: cartItem[],
        public favourites: string[],
        readonly recommendations: string[],
        readonly searchHistory: string[],
        public address: address,
        readonly emailVerified: boolean,
        readonly verificationCode: number,
        readonly registeredWithGoogle: boolean,
        readonly userType: string
    ) {}
}

