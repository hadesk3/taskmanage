import Alert from "../models/alertModel.js";

/**
 * Gửi thông báo đến admin (và lưu vào database)
 * @param {Object} io - Socket.io instance
 * @param {Object} data - Dữ liệu thông báo gồm { taskId, userId, reason, dateExtend }
 */
export const sendNotification = async (io, data) => {
    try {
        // 📌 1. Lưu thông báo vào database
        const alert = new Alert({
            task_id: data.taskId,
            alert_type: "Extend",
            reason: data.reason,
            date_extend: data.dateExtend,
            sent_to: data.adminId, // Admin nhận thông báo
            user: data.userId, // Người gửi yêu cầu
        });

        await alert.save();

        // 📌 2. Gửi thông báo đến Admin qua WebSocket
        const adminSocketId = getAdminSocketId(); // Lấy ID của Admin
        if (adminSocketId) {
            io.to(adminSocketId).emit("new-alert", {
                id: alert._id,
                sender: data.userId,
                reason: data.reason,
                dateExtend: data.dateExtend,
                isRead: false,
            });
        } else {
            console.log("⚠️ Admin chưa online, thông báo chỉ lưu vào DB.");
        }

        return alert;
    } catch (error) {
        console.error("❌ Lỗi khi gửi thông báo:", error);
    }
};

/**
 * Hàm lấy socket ID của Admin
 * Giả sử Admin chỉ có 1 người và ID được lưu khi kết nối
 */
let adminSocketId = null;
export const setAdminSocketId = (socketId) => {
    adminSocketId = socketId;
};
export const getAdminSocketId = () => adminSocketId;
