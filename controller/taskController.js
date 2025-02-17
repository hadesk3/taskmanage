import Task from "../model/TaskModel.js";
import Checklist from "../model/CheckListModel.js";
import pakage from "../middlewares/pakage.js";
import { uploadFile } from "../config/googleDrive.js";

import { Parser } from "json2csv";
import pdf from "html-pdf";

import dotenv from "dotenv";
dotenv.config();

const ADMIN_ID = process.env.ADMIN_ID;

export const getAllTasks = async (req, res) => {
    try {
        const projectId = req.params.id;

        if (!projectId) {
            return res
                .status(400)
                .json(pakage(1, "Project ID is required!", null));
        }

        // Truy vấn task theo project_id
        const tasks = await Task.find({ project_id: projectId }).populate({
            path: "assigned_to", // Populate assigned_to
            select: "name email",
        });

        // Kiểm tra nếu không có task nào
        if (tasks.length === 0) {
            return res.json(
                pakage(2, "No task found!", { user: req.user, ADMIN_ID })
            );
        }

        return res.json(
            pakage(0, "Get tasks successfully!", {
                tasks,
                user: req.user,
                ADMIN_ID,
            })
        );
    } catch (error) {
        console.error("Error fetching tasks by projectId:", error);
        res.status(500).json(pakage(1, "Internal server error!", error));
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTask = async (req, res) => {
    let fileLink = null;
    if (req.file) {
        fileLink = await uploadFile(req.file.path);
    }

    try {
        const checkList = JSON.parse(req.body.checkList || "[]");

        const task = new Task({
            project_id: req.body.project_id,
            assigned_to: req.body.assigned_to,
            title: req.body.title,
            description: req.body.description,
            checkList: checkList,
            deadline: req.body.deadline,
            status: req.body.status,
            media: fileLink,
        });

        const newTask = await task.save();
        res.json(pakage(0, "Task created successfully!", newTask));
    } catch (err) {
        res.json(pakage(1, "Error creating task!", err.message));
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const { checkListIndex, status } = req.body;

        if (!task) {
            return res.json({
                status: 1,
                message: "Task not found!",
                data: null,
            });
        }

        if (req.body.assigned_to) task.assigned_to = req.body.assigned_to;
        if (req.body.title) task.title = req.body.title;
        if (req.body.description) task.description = req.body.description;
        if (req.body.deadline) task.deadline = req.body.deadline;
        if (req.body.status) task.status = req.body.status;

        // Nếu trạng thái thay đổi, cập nhật toàn bộ checklist
        if (status === "Done") {
            task.checkList = task.checkList.map((item) => ({
                ...item,
                status: true,
            }));
        } else if (status === "In Progress") {
            task.checkList = task.checkList.map((item) => ({
                ...item,
                status: false,
            }));
        }

        // Nếu chỉ cập nhật một mục trong checklist
        if (checkListIndex !== undefined && status !== undefined) {
            if (task.checkList[checkListIndex]) {
                task.checkList[checkListIndex].status = status;
            } else {
                return res
                    .status(400)
                    .json({ status: 1, message: "Invalid checklist index!" });
            }
        }

        const updatedTask = await task.save();
        res.json({
            status: 0,
            message: "Task updated successfully!",
            data: updatedTask,
        });
    } catch (err) {
        res.json({
            status: 1,
            message: "Error updating task!",
            error: err.message,
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.json(pakage(1, "Task not found!", null));
        }
        res.json(pakage(0, "Task deleted successfully!", null));
    } catch (err) {
        res.json(pakage(1, "Error deleting task!", err));
    }
};

export const searchTasksByTitle = async (req, res) => {
    try {
        const title = req.query.title;
        const tasks = await Task.find({ title: new RegExp(title, "i") });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const filterTasksByStatus = async (req, res) => {
    try {
        const status = req.query.status;
        const tasks = await Task.find({ status: status });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const exportTasksToCSV = async (req, res) => {
    try {
        const tasks = await Task.find();
        const fields = [
            "title",
            "description",
            "project_id",
            "assigned_to",
            "deadline",
            "status",
        ];
        const opts = { fields };
        const parser = new Parser(opts);
        const csv = parser.parse(tasks);
        res.header("Content-Type", "text/csv");
        res.attachment("tasks.csv");
        res.send(csv);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const exportTasksToPDF = async (req, res) => {
    try {
        const tasks = await Task.find();
        let html = ` <h1>List of taskstasks</h1> <table> <tr> <th>Title</th> <th>Description</th> <th>Project ID</th> <th>Assigned To</th> <th>Deadline</th> <th>Status</th> </tr> `;
        tasks.forEach((task) => {
            html += ` <tr> <td>${task.title}</td> <td>${task.description}</td> <td>${task.project_id}</td> <td>${task.assigned_to}</td> <td>${task.deadline}</td> <td>${task.status}</td> </tr> `;
        });
        html += `</table>`;
        pdf.create(html).toStream((err, stream) => {
            if (err) return res.status(500).json({ message: err.message });
            res.header("Content-Type", "application/pdf");
            res.attachment("tasks.pdf");
            stream.pipe(res);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllTaskAndCheckList = async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ assigned_to: userId })
            .populate("assigned_to")
            .populate("project_id");

        const taskIds = tasks.map((task) => task._id);
        const checklists = await Checklist.find({ task_id: { $in: taskIds } });

        const taskWithChecklist = tasks.map((task) => {
            const relatedChecklist = checklists.filter((c) =>
                c.task_id.equals(task._id)
            );
            return { ...task._doc, checklist: relatedChecklist };
        });

        res.status(200).json(taskWithChecklist);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error });
    }
};
