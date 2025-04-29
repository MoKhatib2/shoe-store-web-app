interface variant {
    _id: string;
    color: string;
    sizes: {
            size: number,
            stock: number
        }[],
    price: number,
    mainImageUrl: string,
    imagesUrls: string[]
}

export class Shoe {
    constructor(
        readonly _id: string,
        readonly name: string,
        readonly type: string,
        readonly newCollection: boolean,
        readonly category: string,
        readonly brand: string,
        readonly variants: variant[],
        readonly tags: string[]
    ) {}
}