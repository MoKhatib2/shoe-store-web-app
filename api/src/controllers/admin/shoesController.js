const shoeModel = require('../../models/shoe.js');
const { userModel } = require('../../models/user.js');
const brandModel = require('../../models/brand.js');

module.exports = {
    addShoe: async (req, res) => {
        const {name, type, category, brand, tags, variant} = req.body;

        if (!name || !type || !category || !brand || !variant || !variant.color || !variant.price || !variant.mainImageUrl) {
            return res.status(400).send('NULL_PARAMETER');
        }
        
        try {
            const existingBrand = await brandModel.findById(brand);
            if (!existingBrand) {
                return res.status(400).json({errorMessage: 'BRAND_DOESNT_EXIST'});
            }
            const variants = [];
            variants.push(variant);
            const newShoe = new shoeModel({name, type, category, brand, tags, variants});
            await newShoe.save();
            res.status(200).json(newShoe);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    addVariant: async (req, res) => {
        const shoeId = req.params.shoeId;
        const variant = req.body;
        if (!variant.color || !variant.price || !variant.mainImageUrl) {
            return res.status(400).send('NULL_PARAMETER');
        }

        try {
            const shoe = await shoeModel.findByIdAndUpdate(shoeId, {$push: {variants: variant}}, {new: true});
            res.status(200).json(shoe);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    editShoe: async (req, res) => {
        const shoeId = req.params.shoeId;
        const {type, category, isNew} = req.query;
        let updates = {};
        if (type) updates.type = type;
        if (category) updates.category = category;
        if (isNew) updates.newCollection = isNew;

        try {
            const updatedShoe = await shoeModel.findByIdAndUpdate(shoeId, updates, {new: true});
            res.status(200).json({shoe: updatedShoe});
        } catch(error) {
            res.status(400).json(error);
        }
    },
    editVariant: async (req, res) => {
        const shoeId = req.params.shoeId;
        const variantId = req.params.variantId;
        const {color, price, mainImageUrl, sizes} = req.body;

        try {
            const shoe = await userModel.findByIdAndUpdate(
                shoeId, {$set: {"variants.$[variant].color": color, 
                                "variants.$[variant].price": price, 
                                "variants.$[variant].mainImageUrl": mainImageUrl, 
                                "variants.$[variant].sizes": sizes }
                        }, 
                {arrayFilters: [{ "variant._id": variantId }], new: true}
            );
            res.status(200).json(shoe);
        } catch (error) {
            res.status(400).json(error);
        }
    },
    addBrand: async (req, res) => {
        const {name, logo} = req.body;

        if(!name) {
            return res.status(400).send('NULL_PARAMETER');
        }
        try {
            const exisitingBrand = await brandModel.find({name});
            if (exisitingBrand.length != 0 ){
                return res.status(400).json({errorMessage: 'NAME_EXISTS'})
            }
            const newBrand = new brandModel({name, logo});
            await newBrand.save();
            res.status(200).json(brand);
        } catch(error) {
            res.status(400).json(error);
        }
    },
    getShoes: async (req, res) => {
        const {brand, type, category, isNew} = req.query;

        let query = {};

        if(brand) query.brand = brand;
        if(type) query.type = type;
        if(category) query.category = category;
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