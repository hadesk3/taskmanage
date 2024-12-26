import express from "express";
import {
    changePassword,
    forgotPassword,
    logout,
    postLogin,
    register,
} from "../controller/authController.js";
import {
    forgotPasswordPage,
    getLoginPage,
} from "../controller/homeController.js";

const router = express.Router();

//[post] /auth/register
router.post("/register", register);

// [get] /auth/login
router.get("/login", getLoginPage);

// [get] /auth/forgot
router.get("/forgot", forgotPasswordPage);

//[post] /auth/login
router.post("/login", postLogin);

// [post] /auth/logout
router.get("/logout", logout);

//[post] /auth/changePassword
router.post("/forgot", forgotPassword);

export default router;
