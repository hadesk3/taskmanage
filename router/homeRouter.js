import express from "express";
import {
    getHomePage,
    getLecturerPage,
    getProjectPage,
    getTaskPage,
    getUserProfilePage,
    getUserEditProfile,
    getReportPage,
    getNotificationPage,
    getExtendFormPage,
} from "../controller/homeController.js";

const router = express.Router();

// [GET] /
router.get("/", getHomePage);

// [GET] /project
router.get("/project", getProjectPage);

// [GET] /task
// router.get("/task", getTaskPage);

// [GET] /task/:id
router.get("/task/:id", getTaskPage);

// [GET] /extend-form
router.get("/notification/:id", getExtendFormPage);

// [GET] /lecturer
router.get("/lecturer", getLecturerPage);

// [GET] /user-profile
router.get("/user-profile", getUserProfilePage);

// [GET] /user-profile-edit
router.get("/edit-profile", getUserEditProfile);

// [GET] /report
router.get("/report", getReportPage);

// [GET] /notification
router.get("/notification", getNotificationPage);

export default router;
