import User from "../model/userModel.js";
import Pakage from "../middlewares/pakage.js";
import { sendMail } from "../utils/mailer.js";

import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import moment from "moment";

export const register = async (req, res) => {
    const { name, email, phone, address, avatar } = req.body;
    const username = email.split("@")[0];

    const checkEmailExist = await User.find({ email: email });
    if (checkEmailExist.length > 0) {
        return res.json(Pakage(1, "Email is exist!", null));
    }

    const password = generatePassword();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username: username,
        name: name,
        email: email,
        password: hashedPassword,
        role: "lecturer",
        status: "active",
        phone: phone,
        address: address,
        avatar: avatar,
        createdAt: moment().format("MM/DD/YYYY, hh:mm:ss"),
    });

    const result = await newUser.save();
    if (!result) return res.json(Pakage(1, "Can not save user", null));

    // send annoucement and password
    const mailResult = await sendMail(
        email,
        "TDTU-Your account has been created",
        accountCreateAccount(name, password)
    );
    if (mailResult.status === "error") {
        return res.json(Pakage(2, "Can not send email", null));
    }
    return res.json(Pakage(0, "Send mail successfully", result));
};

passport.use(
    new LocalStrategy(
        { usernameField: "username" },
        async (username, password, done) => {
            try {
                // tim user trong db
                const user = await User.findOne({ username });

                if (!user) {
                    return done(null, false, {
                        message: "Username or password incorrect",
                    });
                }

                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        // mat khau khop tao token
                        const token = jwt.sign(
                            { _id: user._id, data: user },
                            "THANHBINH",
                            { expiresIn: "24h" }
                        );
                        return done(null, user, { token });
                    } else {
                        // wrong password
                        return done(null, false, {
                            message: "Username or password incorrect",
                        });
                    }
                });
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export const postLogin = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        res.clearCookie("token");
        res.clearCookie("userId");
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json(Pakage(1, info.message, null));
        }

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.cookie("token", info.token, { maxAge: 24 * 60 * 60 * 1000 });
            res.cookie("userId", user._id.toString(), {
                maxAge: 24 * 60 * 60 * 1000,
            });
            const data = user;

            data.password = undefined;
            return res.status(200).json(Pakage(0, "Login successfully", data));
        });
    })(req, res, next);
};

export const logout = (req, res, next) => {
    if (req.logout) {
        req.logout(function (err) {
            if (err) return next(err);
            res.clearCookie("token");
            res.clearCookie("userId");

            res.redirect("/auth/login");
        });
    } else {
        res.clearCookie("token");
        res.redirect("/auth/login");
    }
};

export const changePassword = async (req, res) => {
    try {
        const { uid, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ _id: uid });
        if (!user) {
            return res.json(Pakage(1, "Can not get user", null));
        }

        bcrypt.compare(oldPassword, user.password, async (err, result) => {
            if (result) {
                const hashedPassword = bcrypt.hash(newPassword, 10);
                const dataUpdate = { password: hashedPassword };
                const result = await User.findByIdAndUpdate({
                    _id: uid,
                    dataUpdate,
                    new: true,
                });

                if (user) {
                    return res.json(
                        Pakage(0, "Change password successfully!", null)
                    );
                } else
                    return res.json(Pakage(2, "Can not change password", null));
            } else {
                return res.json(Pakage(1, "Can not change password", null));
            }
        });
    } catch (error) {
        res.json(Pakage(2, "Can not change password", null));
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.json(Pakage(1, "Can not find user", null));

        const password = generatePassword();
        const hashedPassword = bcrypt.hashSync(password, 10);

        user.password = hashedPassword;
        await user.save();

        // Gửi email thông báo
        const mailResult = await sendMail(
            email,
            "Reset your password",
            annouceChangAccount(user.name, password)
        );
        if (mailResult.status === "error")
            return res.json(Pakage(1, "Internal error", mailResult.message));

        return res.json(Pakage(0, "Send email successfully", null));
    } catch (error) {
        return res.json(Pakage(2, "Internal error", error.message));
    }
};

function generatePassword() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

function accountCreateAccount(name, password) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #dddddd;
                    padding: 20px;
                }
                .header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 10px 0;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .content h2 {
                    color: #333333;
                }
                .content p {
                    color: #666666;
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0;
                    font-size: 12px;
                    color: #999999;
                    border-top: 1px solid #dddddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Congratulations!</h1>
                </div>
                <div class="content">
                    <h2>Account Successfully Created</h2>
                    <p>Hello ${name},</p>
                    <p>
                        Your account has been successfully created. Your password is: ${password}. 
                        You can now log in and start using our services.
                    </p>
                </div>
                <div class="footer">
                    <p>If you did not create this account, please disregard this email.</p>
                    <p>&copy; 2024 Group ThanhBinh-ManhHa. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>

    `;
}

function annouceChangAccount(userName, newPassword) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #cccccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
        }
        .content {
            padding: 20px 0;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Notification</h2>
        </div>
        <div class="content">
            <p>Dear ${userName},</p>
            <p>Your password has been successfully reset. Here are your new login details:</p>
            <p><strong>New Password:</strong> ${newPassword}</p>
            <p>Please make sure to change your password after your next login to ensure your account's security.</p>
            <p>If you did not request this change, please contact our support team immediately.</p>
            <p>Best regards,</p>
            <p>Group 49</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 ThanhBinh-ManhHa. All rights reserved.</p>
        </div>
    </div>
</body>
</html> 
    `;
}
