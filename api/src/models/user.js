const mongoose = require('mongoose');
const shoeModel = require('./shoe');
const Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const addressSchema = new Schema({
    city: {
        type: String,
        required: true
    },
    postCode: {
        type: Number,
        required: true
    },
    streetName: {
        type: String,
        required: true
    },
    buildingNumber: {
        type: Number,
        required: true
    },
    apartmentNumber: {
        type: Number,
    }
})

const userSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 50,
        },
        last: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 50,
        },
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    cart: {
        type: [{
            shoeId: {
                type: ObjectId,
                required: true
            },
            variantId: {
                type: ObjectId,
                required: true
            },
            size: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: Number,
                required: true
            }
        }],
        default: []
    },
    favourites:{
        type: [{
            type: ObjectId,
            required: true
        },],
        default: []
    },
    recommendations: {
        type: [{
            type: ObjectId,
            required: true
        },],
        default: []
    },
    searchHistory: {
        type: [String],
        default: []
    },
    address: addressSchema,
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        default: null
    },
    registeredWithGoogle: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        enum: ['admin', 'customer'],
        required: true
    }
},
{
    virtuals: {
        fullName: {
            get() {
                return this.name.first + ' ' + this.name.last;
            }
        }
    },
    methods: {
        isCartEmpty() {
            return this.cart.length === 0;
        }
    }
})

const userModel = mongoose.model('user', userSchema);
module.exports = {userModel, addressSchema};

