import mongoose from "mongoose";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import expressEjsLayouts from "express-ejs-layouts";
import { dirname } from "path";
import { fileURLToPath } from "url";
import homeRoute from "./router/homeRouter.js";
import authRoute from "./router/authRouter.js";
import projectRouter from "./router/projectRouter.js";
import projectUserRouter from "./router/projectUserRouter.js";
import roleRouter from "./router/roleRouter.js";
import taskRouter from "./router/taskRouter.js";
import ExtensionRequestRouter from "./router/ExtensionRequestRouter.js";
import addressRouter from "./router/addressRouter.js";
import checkListRouter from "./router/checkListRouter.js";
import userRouter from "./router/userRoute.js";
import notificationRouter from "./router/notificationRouter.js";
import { checkToken, getUser } from "./middlewares/auth.js";
import Notification from "./model/notificationModel.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io"; // Sử dụng cú pháp import đúng với ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
// app.use(cors());
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true }
    })
);

app.use(flash());

app.set("view engine", "ejs");

const url = process.env.MONGODB_URI;

mongoose
    .connect(url, {})
    .then(() => {
        console.log("Connect to db successfully:\n", url);
    })
    .catch((error) => {
        console.error("Can't connect to db:", error);
    });

// use router
app.use(getUser);
app.use("/auth", authRoute);
app.use("/", checkToken, homeRoute);
app.use("/api", checkToken, projectRouter);
app.use("/api", checkToken, projectUserRouter);
app.use("/api", checkToken, roleRouter);
app.use("/api", checkToken, taskRouter);
app.use("/api", checkToken, ExtensionRequestRouter);
app.use("/api", checkToken, addressRouter);
app.use("/api", checkToken, checkListRouter);
app.use("/api", checkToken, userRouter);
app.use("/api", checkToken, notificationRouter);

// Tạo server HTTP
const server = http.createServer(app);

// Tạo và cấu hình Socket.io
const io = new Server(server, {
    cors: { origin: "*" }, // Cho phép tất cả kết nối
});
const ADMIN_ID = process.env.ADMIN_ID; // Lấy ID admin từ .env

// Lưu trữ userId và socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("🔗 New user connected:", socket.id);

    // Lưu socketId của user khi họ kết nối
    socket.on("register-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`✅ User ${userId} connected with socket ${socket.id}`);
    });

    // User gửi yêu cầu gia hạn thời gian (Gửi đến admin)
    socket.on("send-extend-notification", async (data) => {
        const { taskId, user, reason, dateExtend, title } = data;

        const newAlert = new Notification({
            task_id: taskId,
            alert_type: "Extend",
            reason,
            date_extend: dateExtend,
            sent_to: ADMIN_ID, // Gửi đến admin
            user: user._id, // Người gửi yêu cầu
        });

        await newAlert.save();

        // Gửi thông báo cho admin nếu online
        if (onlineUsers.has(ADMIN_ID)) {
            io.to(onlineUsers.get(ADMIN_ID)).emit("receiveNotification", {
                senderId: data.senderId,
                reason: reason,
                timestamp: new Date().toISOString(),
                user: data.user,
                task_id: { title }, // Thông tin người gửi
            });
        }
    });

    // Admin gửi thông báo đến user cụ thể
    socket.on("send-admin-notification", async (data) => {
        const { userId, message } = data;

        const newAlert = new Alert({
            alert_type: "AdminMessage",
            reason: message,
            sent_to: userId, // Gửi đến user cụ thể
            user: ADMIN_ID, // Admin là người gửi
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

// Khởi động server Express và WebSocket
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});

export { io };

app.post("/assign-task", async (req, res) => {
    // Lấy assigned_to từ req.body, đảm bảo rằng nó là một chuỗi
    const assigned_to = req.body.assigned_to;

    try {
        // Kiểm tra và chuyển assigned_to thành chuỗi nếu cần
        const assignedToString = assigned_to ? assigned_to.toString() : "";

        // Gửi thông báo tới người dùng
        io.to(assignedToString).emit("newTaskAssigned", {
            message: "You have been assigned a new task!",
        });

        console.log(`Notification sent to user ${assignedToString}`);

        res.status(200).json({
            message: "Task assigned and notification sent successfully!",
        });
    } catch (error) {
        console.error("Error assigning task:", error);
        res.status(500).json({
            message: "There was an error assigning the task.",
        });
    }
});

app.get("/extend-time", async (req, res) => {
    // Lấy assigned_to từ req.body, đảm bảo rằng nó là một chuỗi

    try {
        // Kiểm tra và chuyển assigned_to thành chuỗi nếu cần
        const assignedToString = "67615bffb7decdd52980f1ce";
        // Gửi thông báo tới người dùng
        io.to(assignedToString).emit("newTaskAssigned", {
            message: "You have been assigned a new task!",
        });

        console.log(`Notification sent to user ${assignedToString}`);

        res.status(200).json({
            message: "Task assigned and notification sent successfully!",
        });
    } catch (error) {
        console.error("Error assigning task:", error);
        res.status(500).json({
            message: "There was an error assigning the task.",
        });
    }
});
