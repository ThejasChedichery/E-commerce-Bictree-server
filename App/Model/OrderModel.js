const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },
    products: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'products', 
            required: true 
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    shippingAddress: { type: String }
}, { timestamps: true });

const OrderData = mongoose.model('orders', OrderSchema);
module.exports = OrderData;