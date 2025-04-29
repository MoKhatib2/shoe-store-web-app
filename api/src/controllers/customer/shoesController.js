const shoeModel = require('../../models/shoe.js');
const brandModel = require('../../models/brand.js');

module.exports = {
    getShoes: async (req, res) => {
        // add tag
        const {brand, type, category, isNew} = req.query;

        let query = {};

        if(brand) query.brand = brand;
        if(type) query.type = type.toLowerCase();
        if(category) query.category = category.toLowerCase();
        if(isNew) query.newCollection = isNew;

        try {
            const shoes = await shoeModel.find(query);
            res.status(200).json(shoes);
        } catch(error) {
            res.status(400).json(error);
        }

    },
    searchShoes: async (req, res) => {
        const { searchQuery } = req.query;  

        try {
             // get ids of possible brands that were searched for
            const brands = await brandModel
            .find({
                name: {$regex: searchQuery, $options: 'i'}
            })
            .select('_id');

            const shoes = await shoeModel.find({
                $or: [
                    { name: { $regex: searchQuery, $options: 'i'} },
                    { type: { $regex: searchQuery, $options: 'i'} },
                    { brand: { $in : brands}}
                ]
            });

            res.status(200).json(shoes);
        } catch(error) {
            res.status(400).json(error);
        }
       
    }
}