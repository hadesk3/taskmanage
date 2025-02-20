import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";
import flash from "express-flash";
import http from "http";

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
import setupSocket from "./config/socket.js"; // Import socket setup

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Cấu hình Express
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
    })
);
app.use(flash());
app.set("view engine", "ejs");

// Kết nối MongoDB
const url = process.env.MONGODB_URI;
mongoose
    .connect(url, {})
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((error) => {
        console.error("❌ Can't connect to MongoDB:", error);
    });

// Sử dụng các router
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

// Thiết lập WebSocket
const io = setupSocket(server);

// Khởi động server
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

export { io };
