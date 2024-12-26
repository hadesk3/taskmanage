import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import pakage from "../middlewares/pakage.js";

module.exports = {
    register: async (req, res) => {
        try {
            const {
                name,
                email,
                password,
                role,
                status,
                phone,
                address,
                createdAt,
            } = req.body;
            const username = email.split("@")[0];

            const checkEmailExist = await User.find({ email: email });
            if (checkEmailExist.length > 0) {
                return res.json(pakage(1, "Email is exist!", null));
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role: "lecturer",
                status: "active",
                phone: phone,
                createdAt: moment().format("MM/DD/YYYY, hh:mm:ss"),
            });
        } catch (error) {
            return res.json(pakage(2, "Internal server error", error.message));
        }
    },
};
