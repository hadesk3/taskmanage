import Task from "../model/TaskModel.js";
import Checklist from "../model/CheckListModel.js";

import { Parser } from "json2csv";
import pdf from "html-pdf";

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const task = new Task({
    project_id: req.body.project_id,
    assigned_to: req.body.assigned_to,
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    status: req.body.status,
  });

  try {
    const newTask = await task.save();
    res.status(201).json({newTask, message:"Success"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.body.project_id != null) {
      task.project_id = req.body.project_id;
    }
    if (req.body.assigned_to != null) {
      task.assigned_to = req.body.assigned_to;
    }
    if (req.body.title != null) {
      task.title = req.body.title;
    }
    if (req.body.description != null) {
      task.description = req.body.description;
    }
    if (req.body.deadline != null) {
      task.deadline = req.body.deadline;
    }
    if (req.body.status != null) {
      task.status = req.body.status;
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.remove();
    res.status(200).json({ message: "Deleted Task" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
          .populate('assigned_to')
          .populate('project_id');

      const taskIds = tasks.map(task => task._id);
      const checklists = await Checklist.find({ task_id: { $in: taskIds } });

      const taskWithChecklist = tasks.map(task => {
          const relatedChecklist = checklists.filter(c => c.task_id.equals(task._id));
          return { ...task._doc, checklist: relatedChecklist };
      });

      res.status(200).json(taskWithChecklist);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
  }
};


