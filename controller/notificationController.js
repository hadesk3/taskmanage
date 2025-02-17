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
        const userId = req.params.id;
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

export const markAsRead = async (req, res) => {
    try {
        await Alert.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
