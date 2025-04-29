export interface Item {
    _id: string;
    shoeId: string;
    variantId: string;
    size: number;
    quantity: number;
    unitPrice: number;
}
export interface address {
    _id: string;
    city: string;
    postCode: number;
    streetName: string;
    buildingNumber: number;
    apartmentNumber: number;
}

export class Order{
    constructor(
        readonly _id: string,
        readonly userId: string,
        readonly orderNumber: Number,
        readonly items: Item[],
        readonly totalItemsPrice: Number,
        readonly deliveryPrice: Number,
        readonly paymentMethod: string,
        readonly address: address,
        readonly status: string,
        readonly orderPlacedAt: Date,
    ) {}
}