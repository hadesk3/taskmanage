import Project from "../model/projectModel.js";
import { Parser } from "json2csv";
import pdf from "html-pdf";
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const project = new Project({
    name: req.body.name,
    description: "check",
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    type: req.body.type,
    status: req.body.status,
  });

  try {
    const newProject = await project.save();
    res.status(201).json({ newProject, message: 'Project created successfully',   status: 201});
  } catch (err) {
    res.status(400).json({ message: err.message });
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

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.remove();
    res.status(200).json({ message: "Deleted Project" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
