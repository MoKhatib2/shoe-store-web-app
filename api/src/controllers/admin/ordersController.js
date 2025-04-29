const orderModel = require('../../models/order.js');

module.exports = {
    getOrders: async (req, res) => {
        const {userId, orderNumber} = req.query;
        let query = {};
        if (userId) query.userId = userId;
        if (orderNumber) query.orderNumber = orderNumber;

        try {
            const orders = await orderModel.find(query);
            res.status(200).json(orders);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    editOrderStatus: async (req, res) => {
        const {orderNumber, status } = req.body;

        if (!orderNumber || !status) {
            return res.status(400).json('NULL_PARAMETER');
        }

        try {
            const order = await orderModel.findOneAndUpdate({orderNumber}, {status}, {new: true});
            res.status(200).json(order);
        } catch(error) {
            res.status(400).json(error);
        }
    }
}