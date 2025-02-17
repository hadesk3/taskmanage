import Alert from "../model/notificationModel.js";
import pakage from "../middlewares/pakage.js";

export const createNotification = async (data) => {
    try {
        const alert = new Alert({
            task_id: data.taskId,
            reason: data.reason,
            date_extend: data.dateExtend,
            user: data.userId,
            isRead: false,
        });
        await alert.save();
        return res.json(pakage("success", "Notification created successfully"));
    } catch (error) {
        console.error("❌ Error saving notification:", error);
        throw new Error("Error creating notification");
    }
};

export const getNotifications = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 });
        res.json(pakage());
    } catch (error) {
        res.status(500).json({ error: "Server error" });
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
