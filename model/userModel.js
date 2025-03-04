import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
        enum: ["headofsubject", "lecturer"],
    },
    status: {
        type: String,
        required: true,
        enum: [
            "active",
            "inactive",
            "pending_verify",
            "pending_password",
            "banned",
        ],
    },
    phone: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default:
            "https://firebasestorage.googleapis.com/v0/b/phone-c4bc5.appspot.com/o/default_avatar.jpg?alt=media&token=0ff85744-9209-457b-aaf8-66d1f6893155",
    },
    address: {
        type: String,
        default: "",
    },
    major: {
        type: String,
        enum: ["software_enginerr", "computer_science", "CNnDC"],
    },
    createdAt: {
        type: String,
        require: true,
    },
});

const User = mongoose.model("User", userSchema);
import bcrypt from "bcrypt";
import moment from "moment";
try {
    User.findOne({ username: "admin" }).then(async (user) => {
        if (!user) {
            const hashedPassword = await bcrypt.hash("admin", 10);
            User.create({
                username: "admin",
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "headofsubject",
                status: "active",
                phone: "",
                createdAt: moment().format("MM/DD/YYYY, hh:mm:ss"),
            });
        }
    });
} catch (error) {
    console.log(error);
}

export default User;
