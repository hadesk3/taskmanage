import express from "express";
import {
    createNotification,
    getNotifications,
    markAsRead,
} from "../controller/notificationController.js";

const router = express.Router();

router.post("/", createNotification); // Tạo thông báo
router.get("/", getNotifications); // Lấy danh sách thông báo
router.put("/:id/read", markAsRead); // Đánh dấu thông báo đã đọc

export default router;
