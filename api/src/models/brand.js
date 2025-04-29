const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String
    }
})

const brandModel = mongoose.model('brand', brandSchema);
module.exports = brandModel;