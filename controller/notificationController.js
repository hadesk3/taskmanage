import Alert from "../model/notificationModel.js";
import pakage from "../middlewares/pakage.js";

export const createNotification = async (data) => {
    try {
        const userId = req.params.userId;
        const notifications = await Alert.find({ sent_to: userId })
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian gần nhất
            .limit(20);

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.params.Uid;
        const notifications = await Alert.find({ sent_to: userId })
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian gần nhất
            .limit(20)
            .populate("task_id", "title description") // Lấy thông tin về tên và mô tả nhiệm vụ
            .populate("user", "name avatar") // Lấy thông tin người gửi
            .populate("sent_to", "name avatar"); // Lấy thông tin người nhận

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getNotificationById = async (req, res) => {
    try {
        const alerId = req.params.id;
        const notifications = await Alert.find({ _id: alerId })
            .populate("task_id", "title description") // Lấy thông tin về tên và mô tả nhiệm vụ
            .populate("user", "name avatar") // Lấy thông tin người gửi
            .populate("sent_to", "name avatar"); // Lấy thông tin người nhận

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Đánh dấu là đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { ids } = req.body;
        await Alert.updateMany(
            { _id: { $in: ids } },
            { $set: { isRead: true } }
        );
        res.json({ message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({
            message: "Error marking notifications as read",
            error,
        });
    }
};

// Đánh dấu là chưa đọc
export const markAsUnread = async (req, res) => {
    try {
        const { ids } = req.body;
        await Alert.updateMany(
            { _id: { $in: ids } },
            { $set: { isRead: false } }
        );
        res.json({ message: "Notifications marked as unread" });
    } catch (error) {
        res.status(500).json({
            message: "Error marking notifications as unread",
            error,
        });
    }
};

// Xóa thông báo
export const deleteNotifications = async (req, res) => {
    try {
        const { ids } = req.body;
        await Alert.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Notifications deleted" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting notifications",
            error,
        });
    }
};
