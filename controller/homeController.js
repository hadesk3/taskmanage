export const getLoginPage = (req, res) => {
    const title = "Login";
    res.render("auth/login", { title: title, page: "auth/login" });
};

export const forgotPasswordPage = (req, res) => {
    const title = "Forgot password";
    res.render("auth/forgot_password", {
        title: title,
        page: "auth/forgot_password",
    });
};

export const getHomePage = (req, res) => {
    const title = "Task management";
    res.render("home/index", {
        title: title,
        page: "/",
    });
};

export const getProjectPage = (req, res) => {
    const title = "Project Management";
    res.render("project/index", {
        title: title,
        page: "project",
    });
};

export const getTaskPage = (req, res) => {
    const title = "Task Management";
    res.render("task/index", {
        title: title,
        page: "task",
    });
};

export const getLecturerPage = (req, res) => {
    const title = "Lecturer Management";
    res.render("lecturer/index", {
        title: title,
        page: "lecturer",
    });
};

export const getUserProfilePage = (req, res) => {
    const title = "User Profile";
    res.render("user/user-profile", {
        title: title,
        page: "lecturer-profile",
    });
};

export const getUserEditProfile = (req, res) => {
    const title = "Edit Profile";
    res.render("user/user-profile-edit", {
        title: title,
        page: "lecturer-profile-edit",
    });
};

export const getAddUserPage = (req, res) => {
    const title = "Add User";
    res.render("lecturer/user-add", {
        title: title,
        page: "lecturer/add",
    });
};

export const getReportPage = (req, res) => {
    const title = "Report";
    res.render("report/index", {
        title: title,
        page: "report",
    });
};

export const getNotificationPage = (req, res) => {
    const title = "Notification";
    res.render("notification/index", {
        title: title,
        page: "notification",
    });
};

export const getExtendFormPage = (req, res) => {
    const title = "Extend Form";
    res.render("task/extend-form", {
        title: title,
        page: "extend",
    });
};
