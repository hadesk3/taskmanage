import { Server } from "socket.io";
import Notification from "../model/notificationModel.js"; // Import model
import dotenv from "dotenv";

dotenv.config();

const ADMIN_ID = process.env.ADMIN_ID; // Lấy ID admin từ .env
const onlineUsers = new Map(); // Lưu trữ userId và socketId

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: "*" }, // Cho phép tất cả kết nối
    });

    io.on("connection", (socket) => {
        console.log("🔗 New user connected:", socket.id);

        // Lưu socketId của user khi họ kết nối
        socket.on("register-user", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`✅ User ${userId} connected with socket ${socket.id}`);
        });

        // User gửi yêu cầu gia hạn thời gian (Gửi đến admin)
        socket.on("send-extend-notification", async (data) => {
            const { taskId, user, reason, dateExtend, title, imageUrl } = data;

            const newAlert = new Notification({
                task_id: taskId,
                alert_type: "Extend",
                reason,
                date_extend: dateExtend,
                sent_to: ADMIN_ID,
                user: user._id,
                proof: imageUrl,
            });

            const result = await newAlert.save();

            // Gửi thông báo cho admin nếu online
            if (onlineUsers.has(ADMIN_ID)) {
                io.to(onlineUsers.get(ADMIN_ID)).emit("receiveNotification", {
                    alert_type: "Extend",
                    _id: result._id,
                    senderId: data.senderId,
                    reason: reason,
                    timestamp: result.timestamp,
                    user: data.user,
                    task_id: { title },
                    date_extend: dateExtend,
                });
            }
        });

        // Admin gửi thông báo đến user cụ thể
        socket.on("send-admin-notification", async (data) => {
            const { userId, message } = data;

            const newAlert = new Notification({
                alert_type: "AdminMessage",
                reason: message,
                sent_to: userId,
                user: ADMIN_ID,
            });

            await newAlert.save();

            // Gửi thông báo cho user nếu họ online
            if (onlineUsers.has(userId)) {
                io.to(onlineUsers.get(userId)).emit(
                    "receive-notification",
                    newAlert
                );
            }
        });

        // Admin thêm user vào project
        socket.on("add-user-project", async (data) => {
            const { users, message, projectId } = data;
            console.log(data);

            const newAlert = new Notification({
                alert_type: "Assign",
                reason: message,
                sent_to: users.map((user) => user._id),
                user: ADMIN_ID,
                project_id: projectId,
            });

            await newAlert.save();

            // Gửi thông báo cho user nếu họ online
            users.forEach((user) => {
                if (onlineUsers.has(user._id)) {
                    io.to(onlineUsers.get(user._id)).emit(
                        "receiveNotification",
                        {
                            alert_type: "Assign",
                            project_id: {
                                _id: projectId,
                                name: data.projectName,
                            },
                            user: user,
                            reason: message,
                            timestamp: newAlert.timestamp,
                        }
                    );
                }
            });
        });

        // Xóa user khỏi danh sách khi ngắt kết nối
        socket.on("disconnect", () => {
            for (let [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    console.log(`❌ User ${key} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

export default setupSocket;
