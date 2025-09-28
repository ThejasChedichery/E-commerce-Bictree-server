const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    subCategoryId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'categories',
        required: true 
    },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductData = mongoose.model('products', ProductSchema);
module.exports = ProductData;