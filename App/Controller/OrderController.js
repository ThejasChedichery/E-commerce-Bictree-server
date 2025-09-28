const OrderData = require('../Model/OrderModel');
const ProductData = require('../Model/ProductModel');
const NotificationData = require('../Model/NotificationModel');

// Place order
const PlaceOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;
        let totalPrice = 0;
        const orderProducts = [];

        // Check stock and calculate total
        for (let item of products) {
            const product = await ProductData.findById(item.productId);
            if (!product) {
                return res.status(400).send({ message: `Product not found: ${item.productId}` });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).send({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
                });
            }

            totalPrice += product.price * item.quantity;
            orderProducts.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create order
        const orderData = new OrderData({
            userId: req.id,
            products: orderProducts,
            totalPrice,
            shippingAddress
        });

        const savedOrder = await orderData.save();

        // Reduce stock
        for (let item of products) {
            await ProductData.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Create notification for admin
        const notification = new NotificationData({
            message: `New order placed by user ${req.id}`,
            type: 'order_placed',
            orderId: savedOrder._id
        });
        await notification.save();

        // Send real-time notification to admin
        req.io.to('admin_room').emit('new_order', {
            message: 'New order placed!',
            orderId: savedOrder._id,
            userId: req.id
        });

        res.status(201).send({ 
            message: "Order placed successfully", 
            order: savedOrder 
        });
    } catch (err) {
        res.status(500).send({ message: 'Cannot place order', err });
    }
};

// Update order status (Admin only)
const UpdateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const updatedOrder = await OrderData.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('userId', 'userName email');

        if (!updatedOrder) {
            return res.status(400).send({ message: "Order not found" });
        }

        // Create notification for user
        const notification = new NotificationData({
            userId: updatedOrder.userId._id,
            message: `Your order status updated to: ${status}`,
            type: 'order_status_changed',
            orderId: orderId
        });
        await notification.save();

        // Send real-time notification to user
        req.io.to(`user_${updatedOrder.userId._id}`).emit('order_status_update', {
            message: `Your order status updated to: ${status}`,
            orderId: orderId,
            status: status
        });

        res.status(200).send({ 
            message: "Order status updated successfully", 
            order: updatedOrder 
        });
    } catch (err) {
        res.status(500).send({ message: 'Cannot update order status', err });
    }
};

// Get user orders
const GetUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await OrderData.find({ userId })
            .populate('products.productId', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).send({ 
            message: "Orders fetched successfully", 
            data: orders 
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch orders', error });
    }
};

// Get all orders (Admin only)
const GetAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await OrderData.find(query)
            .populate('userId', 'userName email')
            .populate('products.productId', 'name price')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await OrderData.countDocuments(query);

        res.status(200).send({
            message: "Orders fetched successfully",
            data: orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch orders', error });
    }
};

module.exports = { PlaceOrder, UpdateOrderStatus, GetUserOrders, GetAllOrders };