const mongoose = require('mongoose');
const Schema = mongoose.Schema,
ObjectId = mongoose.ObjectId;

const variantSchema =  new Schema({
    color: {
        type: String,
        required: true
    },
    sizes:  {
        type: [
            {
                _id: false,
                size: {type: Number, required: true},
                stock: {type: Number, required: true}
            }
        ],
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    mainImageUrl: {
        type: String,
        required: true
    },
    imagesUrls: {
        type: [{type: String}],
        default: []
    }
})

const shoeSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    },
    type: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex', 'Kids']
    },
    newCollection: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: ObjectId,
        required: true
    },
    variants: {
        type: [variantSchema],
        minlength: 1
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    methods: {
        isAvailabe(color, size) {
            return this.variants.filter(variant => {
                variant.color === color && variant.sizes.filter(s => s.size == size && s.stock > 0).length != 0
            }).length != 0;
        },
    }
});

const shoeModel = new mongoose.model('shoe', shoeSchema);
module.exports = shoeModel;


