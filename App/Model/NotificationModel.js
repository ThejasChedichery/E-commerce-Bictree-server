const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users' 
    },
    message: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['order_placed', 'order_status_changed', 'low_stock'], 
        required: true 
    },
    isRead: { type: Boolean, default: false },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'orders' 
    }
}, { timestamps: true });

const NotificationData = mongoose.model('notifications', NotificationSchema);
module.exports = NotificationData;