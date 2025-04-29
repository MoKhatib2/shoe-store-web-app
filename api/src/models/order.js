const mongoose = require('mongoose');
const Schema = mongoose.Schema,
ObjectId = mongoose.Types.ObjectId

const {addressSchema} = require('./user.js');

const itemSchema = new Schema({
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
})

const orderSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    orderNumber: {
        type: Number,
        required: true,
    },
    items: [itemSchema],
    totalItemsPrice: {
        type: Number,
        required: true
    },
    deliveryPrice: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card'],
        required: true
    },
    address: addressSchema,
    status: {
        type: String,
        enum: ['preparing', 'shipped', 'deliverd'],
        required: true 
    },
    orderPlacedAt: {
        type: Date,
        default: Date.now
    },
})

const orderModel = new mongoose.model('order', orderSchema);
module.exports = orderModel;