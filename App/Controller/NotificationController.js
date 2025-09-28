
const NotificationData = require('../Model/NotificationModel');

// Get notifications for a user
const GetUserNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await NotificationData.find({ userId })
            .populate('orderId', 'status totalPrice')
            .sort({ createdAt: -1 });

        res.status(200).send({
            message: "Notifications fetched successfully",
            data: notifications
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch notifications', error });
    }
};

// Mark notification as read
const MarkAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await NotificationData.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).send({ message: "Notification not found" });
        }

        res.status(200).send({
            message: "Notification marked as read",
            data: updatedNotification
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot update notification', error });
    }
};

// Admin: Get all notifications
const GetAllNotifications = async (req, res) => {
    try {
        const notifications = await NotificationData.find()
            .populate('userId', 'userName email')
            .populate('orderId', 'status totalPrice')
            .sort({ createdAt: -1 });

        res.status(200).send({
            message: "All notifications fetched successfully",
            data: notifications
        });
    } catch (error) {
        res.status(500).send({ message: 'Cannot fetch notifications', error });
    }
};

module.exports = { GetUserNotifications, MarkAsRead, GetAllNotifications };
