import express from "express";
import {
    getHomePage,
    getLecturerPage,
    getProjectPage,
    getTaskPage,
    getUserProfilePage,
    getUserEditProfile,
} from "../controller/homeController.js";

const router = express.Router();

// [GET] /
router.get("/", getHomePage);

// [GET] /project
router.get("/project", getProjectPage);

// [GET] /task
router.get("/task", getTaskPage);

// [GET] /lecturer
router.get("/lecturer", getLecturerPage);

// [GET] /user-profile
router.get("/user-profile", getUserProfilePage);

// [GET] /user-profile-edit
router.get("/edit-profile", getUserEditProfile);

export default router;
