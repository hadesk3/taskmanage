import Project from "../model/ProjectModel.js";
import Task from "../model/TaskModel.js";
import ProjectUser from "../model/ProjectUserModel.js";
import pakage from "../middlewares/pakage.js";

import { Parser } from "json2csv";

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate({
            path: "lecturers", // Populate lecturers
            select: "name avatar", // Chỉ lấy name và avatar của lecturers
        });
        res.status(200).json(pakage(0, "Get project successfully!", projects));
    } catch (err) {
        res.status(500).json(pakage(1, "Internal server error!", err.message));
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project == null) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createProject = async (req, res) => {
    console.log(req.body.lecturers);

    const project = new Project({
        name: req.body.name,
        description: req.body.description,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        lecturers: req.body.lecturers,
        type: req.body.type,

        status: req.body.status,
    });

    try {
        const newProject = await project.save();
        res.json(pakage(0, "Create project successfully!", newProject));
    } catch (err) {
        res.json(pakage(1, "Internal server error!", err.message));
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project == null) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (req.body.name != null) {
            project.name = req.body.name;
        }
        if (req.body.description != null) {
            project.description = req.body.description;
        }
        if (req.body.start_date != null) {
            project.start_date = req.body.start_date;
        }
        if (req.body.end_date != null) {
            project.end_date = req.body.end_date;
        }
        if (req.body.type != null) {
            project.type = req.body.type;
        }
        if (req.body.status != null) {
            project.status = req.body.status;
        }
        if (req.body.lecturers != null) {
            project.lecturers = req.body.lecturers;
        }

        const updatedProject = await project.save();
        res.json(pakage(0, "Update project successfully!", updatedProject));
    } catch (err) {
        res.json(pakage(1, "Internal server error!", err.message));
    }
};

export const deleteProject = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log(_id);

        const result = await Project.findByIdAndDelete(_id);
        if (!result) {
            return res.json(pakage(1, "Can not delete project", null));
        }

        return res.json(pakage(0, "Delete project successfully", result));
    } catch (err) {
        res.json(pakage(1, "Internal server error!", err.message));
    }
};

export const searchProjectsByTitle = async (req, res) => {
    try {
        const title = req.query.title;
        const projects = await Project.find({ name: new RegExp(title, "i") });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const filterProjectsByStatus = async (req, res) => {
    try {
        const status = req.query.status;
        const projects = await Project.find({ status: status });
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const exportProjectsToCSV = async (req, res) => {
    try {
        const projects = await Project.find();
        const fields = [
            "name",
            "description",
            "start_date",
            "end_date",
            "type",
            "status",
        ];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(projects);
        res.header("Content-Type", "text/csv");
        res.attachment("projects.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getProjects = async (req, res) => {
    try {
        // Lấy tất cả các dự án và populate ProjectUser, sau đó populate User từ ProjectUser
        const projects = await Project.find().lean();

        for (let project of projects) {
            // Tìm tất cả các ProjectUser liên quan đến project này
            const projectUsers = await ProjectUser.find({
                project_id: project._id,
            })
                .populate("user_id", "username") // Populate user_id từ ProjectUser để lấy thông tin username
                .lean();

            // Lấy danh sách các username của người dùng liên quan đến dự án
            project.users = projectUsers.map((pu) => pu.user_id.username);

            // Tính toán tiến trình của dự án
            const tasks = await Task.find({ project_id: project._id }).lean();
            const completedTasks = tasks.filter(
                (task) => task.status === "Done"
            ).length;
            const totalTasks = tasks.length;
            project.progress =
                totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        }

        // Trả về thông tin các dự án với danh sách người dùng và tiến trình
        res.json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).send("Lỗi server");
    }
};
