import express from "express";
import {
    createNotification,
    getNotifications,
    markAsRead,
    markAsUnread,
    deleteNotifications,
    getNotificationById,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/notifications/:Uid", getNotifications); // Lấy danh sách thông báo
router.get("/notification/:id", getNotificationById); // Lấy thông tin thông báo
router.post("/notifications", createNotification); // Tạo thông báo
router.post("/notifications/mark-as-read", markAsRead); // Đánh dấu thông báo đã đọc
router.post("/notifications/mark-as-unread", markAsUnread); // Đánh dấu tất cả thông báo đã đọc
router.post("/notifications/delete", deleteNotifications); // Xóa thông báo

export default router;
