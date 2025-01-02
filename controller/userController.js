import { Parser } from "json2csv";
import pdf from "html-pdf";

import User from "../model/userModel.js";
import pakage from "../middlewares/pakage.js";

export const searchUsersByUsername = async (req, res) => {
    try {
        const username = req.query.username;
        const users = await User.find({ username: new RegExp(username, "i") });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const filterUsersByStatus = async (req, res) => {
    try {
        const status = req.query.status;
        const users = await User.find({ status: status });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//[get] user/
export const getAllUsers = async (req, res) => {
    try {
        // find user with role is lecturer
        const users = await User.find({ role: "lecturer" }).select("-password");
        res.status(200).json(pakage(0, "Get user successfully!", users));
    } catch (err) {
        res.status(500).json(pakage(1, "Internal server error!", err.message));
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createUser = async (req, res) => {
    const { name, email, phone, address } = req.body;
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
        createdAt: moment().format("MM/DD/YYYY, hh:mm:ss"),
    });

    // send annoucement and password
    const mailResult = await sendMail(
        email,
        "TDTU-Your account has been created",
        accountCreateAccount(name, password)
    );
    if (mailResult.status === "error") {
        const result = await newUser.save();
        if (!result) return res.json(pakage(1, "Can not save user", null));
        return res.json(pakage(2, "Can not send email", null));
    }
    return res.json(pakage(0, "Send mail successfully", result));
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.body.username != null) {
            user.username = req.body.username;
        }
        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }
        if (req.body.password != null) {
            user.password = req.body.password;
        }
        if (req.body.role != null) {
            user.role = req.body.role;
        }
        if (req.body.status != null) {
            user.status = req.body.status;
        }
        if (req.body.phone != null) {
            user.phone = req.body.phone;
        }
        if (req.body.avatar != null) {
            user.avatar = req.body.avatar;
        }
        if (req.body.address != null) {
            user.address = req.body.address;
        }
        if (req.body.createdAt != null) {
            user.createdAt = req.body.createdAt;
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await User.findByIdAndDelete(_id);
        if (!result) return res.json(pakage(1, "Can not delete user", null));
        return res.json(pakage(0, "Delete user successfully", result));
    } catch (err) {
        res.status(500).json(pakage(1, "Internal server error!", err.message));
    }
};

export const exportUsersToCSV = async (req, res) => {
    try {
        const users = await User.find();
        const fields = [
            "username",
            "name",
            "email",
            "role",
            "status",
            "phone",
            "address",
            "createdAt",
        ];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(users);
        res.header("Content-Type", "text/csv");
        res.attachment("users.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const exportUsersToPDF = async (req, res) => {
    try {
        const users = await User.find();
        let html = ` <h1>List of Users</h1> <table> <tr> <th>Username</th> <th>Name</th> <th>Email</th> <th>Role</th> <th>Status</th> <th>Phone</th> <th>Address</th> <th>Created At</th> </tr> `;
        users.forEach((user) => {
            html += ` <tr> <td>${user.username}</td> <td>${user.name}</td> <td>${user.email}</td> <td>${user.role}</td> <td>${user.status}</td> <td>${user.phone}</td> <td>${user.address}</td> <td>${user.createdAt}</td> </tr> `;
        });
        html += `</table>`;
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.status(500).json({ message: err.message });
            res.header("Content-Type", "application/pdf");
            res.attachment("users.pdf");
            stream.pipe(res);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
