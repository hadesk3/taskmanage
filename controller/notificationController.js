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
            .populate("sent_to", "name avatar") // Lấy thông tin người nhận
            .populate("project_id", "name");

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

export const getNotificationById = async (req, res) => {
    try {
        const alerId = req.params.id;
        const alerts = await Alert.find({ _id: alerId })
            .populate({
                path: "task_id",
                populate: {
                    path: "project_id",
                    model: "Project",
                },
            })
            .populate("user", "name avatar") // Lấy thông tin người tạo alert
            .populate("sent_to", "name email") // Lấy thông tin admin nhận alert
            .populate("project_id", "name");

        // Định dạng lại dữ liệu để dễ đọc
        const formattedAlerts = alerts.map((alert) => ({
            _id: alert._id,
            alert_type: alert.alert_type,
            reason: alert.reason,
            date_extend: alert.date_extend,
            timestamp: alert.timestamp,
            isRead: alert.isRead,
            proof: alert.proof,
            user: alert.user,
            sent_to: alert.sent_to,
            task: alert.task_id
                ? {
                      _id: alert.task_id._id,
                      title: alert.task_id.title,
                      project: alert.task_id.project_id
                          ? {
                                _id: alert.task_id.project_id._id,
                                name: alert.task_id.project_id.name,
                            }
                          : null,
                  }
                : null,
            project: alert.project_id
                ? {
                      _id: alert.project_id._id,
                      name: alert.project_id.name,
                  }
                : null,
        }));

        res.status(200).json({ success: true, data: formattedAlerts });
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
