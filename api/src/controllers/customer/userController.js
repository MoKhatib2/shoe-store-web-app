const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const {userModel} = require('../../models/user.js');
const shoeModel = require('../../models/shoe.js');
const orderModel = require('../../models/order.js');

module.exports = {
    getCurrUser: async (req, res) => {
        const userId = req.userId;
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(400).json({errorMessage: 'USER_DOESNT_EXIST'});
            }
            res.status(200).json(user);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    addToFavourites: async (req, res) => {
        const shoeId = req.body.shoeId;
        const userId = req.userId;

        try {   
            await userModel.findByIdAndUpdate(userId, {$addToSet : {favourites: shoeId}});
            res.status(200).json();
        } catch (error) {
            res.status(400).json(error);
        }
    },
    removeFromFavourites: async (req, res) => {
        const shoeId = req.body.shoeId;
        const userId = req.userId;
        try {   
            await userModel.findByIdAndUpdate(userId, {$pull : {favourites: shoeId}});
            res.status(200).json();
        } catch (error) {
            res.status(400).json(error);
        }
    },
    addToCart: async (req, res) => {
        const {shoeId, variantId, size, quantity} = req.body;
        const userId = req.userId;

        if(quantity <= 0) {
            return res.status(400).json({errorMessage: 'INVALID_QUANTITY'});
        }
        try {
            let user = await userModel.findById(userId);
            if (!user) {
                return res.status(400).json({errorMessage: 'USER_DOESNT_EXIST'});
            }
            console.log(shoeId);
            const shoe = await shoeModel.findById(shoeId);
            if (!shoe) {
                return res.status(400).json({errorMessage: 'SHOE_DOESNT_EXIST'});
            }
            const shoeVariant = shoe.variants.filter(v => v._id.equals(variantId));
            if (shoeVariant.length != 0) {
                const cart = user.cart;
                const itemAddedBefore = cart.filter(item => item.shoeId.equals(shoeId) && item.variantId.equals(variantId) && item.size === size);
                const requiredQuantity = itemAddedBefore.length != 0 ? itemAddedBefore[0].quantity + quantity : quantity;
                const availableSize = shoeVariant[0].sizes.filter(s => s.size === size && s.stock >= requiredQuantity);
                if (availableSize != 0) {
                    let itemAdded = false;
                    let newCart = cart.map(item => {
                        if (item.shoeId.equals(shoeId) && item.variantId.equals(variantId) && item.size === size) {
                            itemAdded = true;
                            return {_id:item._id, shoeId, variantId, size, quantity: requiredQuantity, unitPrice: shoeVariant[0].price};
                        } 
                        return item;
                    });
                    if (!itemAdded) {
                        newCart.push({ shoeId, variantId, size, quantity: requiredQuantity, unitPrice: shoeVariant[0].price})
                    }
                    user = await userModel.findByIdAndUpdate(userId, {cart: newCart}, {new: true});
                    return res.status(200).json({cart: user.cart});
                } 
            }
            res.status(400).json({errorMessage: 'NOT_ENOUGH_STOCK'});
        } catch (error) {
            res.status(400).json({error});
        }
    },
    removeFromCart: async (req, res) => {
        const {cartItemId, quantity} = req.body;
        const userId = req.userId;
        try {
            const user = await userModel.findById(userId);
            const cart = user.cart;
            let newQuantity;
            let newCart = cart.map((cartItem) => {
                if (cartItem._id.equals(cartItemId)) {
                    newQuantity = cartItem.quantity - quantity;
                    cartItem.quantity = newQuantity;
                }
                return cartItem;
            })

            if (newQuantity < 0) {
                return res.status(400).json({errorMessage: 'INVALID_QUANTITY'});
            }

            if (newQuantity === 0) {
                newCart = newCart.filter((cartItem) => !cartItem._id.equals(cartItemId));
            }

            await user.updateOne({cart: newCart});
            res.status(200).json({cart: newCart});
        } catch(error) {
            res.status(400).json({error});
        }
    },
    getCartDetails: async (req, res) => {
        const userId = req.userId;

        try {
            const user = await userModel.findById(userId);
            const cart = user.cart;
            const shoeIds = cart.map(cartItem => cartItem.shoeId);
            const shoes = await shoeModel.find({_id: {'$in': shoeIds}});
            console.log(cart);
            const cartDetails = cart.map(cartItem => {
                const shoe = shoes.filter(shoe => shoe._id.equals(cartItem.shoeId))[0];
                const shoeVariant = shoe.variants.filter(variant => variant._id.equals(cartItem.variantId))[0];
                const shoeSize = shoeVariant.sizes.filter(size => size.size === cartItem.size)[0];
                return {
                    ...cartItem.toObject(),
                    shoe,
                    unitPrice: shoeVariant.price,
                    stock: shoeSize.stock
                }
            });
            res.status(200).json(cartDetails);
        } catch(error) {
            res.status(200).json(error);
        }
    },
    addAddress: async (req, res) => {
        const address = req.body;
        const userId = req.userId;
        if (!address || !address.city || !address.postCode || !address.streetName || !address.buildingNumber) {
            return res.status(400).json({errorMessage: 'NULL_PARAMETER'});
        }
        try {
            await userModel.findByIdAndUpdate(userId, {$set: {address}});
            res.status(200).json({message: 'SUCCESS'});
        } catch (error) {   
            res.status(400).json(error);
        }
    },
    getOrders: async (req, res) => {
        const userId = req.userId;
        try {
            const orders = await orderModel.find({userId});
            res.status(200).json(orders);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    payByCash: async (req, res) => {
        const userId = req.userId;
        try {
            const user = await userModel.findById(userId);
            const cart = user.cart;
            if (cart.length === 0) {
                return res.status(400).json({errorMessage: 'EMPTY_CART'});
            }
            const stockUpdated = await updateStock(cart);
            if (!stockUpdated) {
                return res.status(400).json({errorMessage: 'NOT_ENOUGH_STOCK'});
            }
            await userModel.findByIdAndUpdate(userId, {cart: []});
            const order = await createOrder(userId, cart, user.address, 'cash');
            res.status(200).json(order)
        } catch(error) {
            res.status(400).json(error);
        }
        
    },
    payByCard: (req, res) => {
      
    }
}

async function checkEnoughStock(cart) {
    const shoeIds = cart.map(cartItem => cartItem.shoeId);
    const shoes = await shoeModel.find({_id: {'$in': shoeIds}});
    let enoughStock = true;
    cart.forEach(cartItem => {
        const shoe = shoes.filter(shoe => shoe._id.equals(cartItem.shoeId))[0];
        const shoeVariant = shoe.variants.filter(variant => variant._id.equals(cartItem.variantId))[0];
        const shoeSize = shoeVariant.sizes.filter(size => size.size === cartItem.size)[0];
        if (cartItem.quantity > shoeSize.stock) {
            enoughStock = false;
            return;
        }
    });
    return enoughStock;
}

async function updateStock(cart) {
    const shoeIds = cart.map(cartItem => cartItem.shoeId);
    const shoes = await shoeModel.find({_id: {'$in': shoeIds}});
    let enoughStock = true;
    const stockUpdateDetails = cart.map(cartItem => {
        const shoe = shoes.filter(shoe => shoe._id.equals(cartItem.shoeId))[0];
        const shoeVariant = shoe.variants.filter(variant => variant._id.equals(cartItem.variantId))[0];
        let shoeSize = shoeVariant.sizes.filter(size => size.size === cartItem.size);
        if(shoeSize.length === 0) {
            enoughStock = false;
            return {
                ...cartItem.toObject(),
                newStock: 0
            }
        }
        shoeSize = shoeSize[0];
        if (cartItem.quantity > shoeSize.stock) {
            enoughStock = false;
        }
        const newStock = shoeSize.stock - cartItem.quantity;
        return {
            ...cartItem.toObject(),
            newStock
        }
    });

    if (!enoughStock) {
        return false;
    }

    console.log(stockUpdateDetails)
    stockUpdateDetails.forEach(async stockUpdate => {
        await shoeModel.findByIdAndUpdate(
            stockUpdate.shoeId,
            { $set: { "variants.$[outer].sizes.$[inner].stock": stockUpdate.newStock } },
            { arrayFilters: [{ "outer._id": stockUpdate.variantId }, { "inner.size": stockUpdate.size }], new: true }
        );
    });
    return true;
}

async function createOrder(userId, cart, address, paymentMethod) {
    const orderNumber = Math.floor((Math.random() * 10000000)) + 1000000;
    console.log(orderNumber)
    let totalItemsPrice = 0;
    cart.forEach(cartItem => {
        totalItemsPrice += cartItem.unitPrice * cartItem.quantity;
    });
    console.log(totalItemsPrice)
    const newOrder = new orderModel({userId, orderNumber, items: cart, totalItemsPrice, paymentMethod, address, status: 'preparing'});
    await newOrder.save();
    console.log(newOrder)
    return newOrder;
}