import ProjectUser from "../model/ProjectUserModel.js";
export const getAllProjectUsers = async (req, res) => {
  try {
    const projectUsers = await ProjectUser.find();
    res.status(200).json(projectUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectUserById = async (req, res) => {
  try {
    const projectUser = await ProjectUser.findById(req.params.id);
    if (projectUser == null) {
      return res.status(404).json({ message: "Project User not found" });
    }
    res.status(200).json(projectUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProjectUser = async (req, res) => {
  const projectUser = new ProjectUser({
    project_id: req.body.project_id,
    user_id: req.body.user_id,
  });

  try {
    const newProjectUser = await projectUser.save();
    res.status(201).json(newProjectUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProjectUser = async (req, res) => {
  try {
    const projectUser = await ProjectUser.findById(req.params.id);
    if (projectUser == null) {
      return res.status(404).json({ message: "Project User not found" });
    }

    if (req.body.project_id != null) {
      projectUser.project_id = req.body.project_id;
    }
    if (req.body.user_id != null) {
      projectUser.user_id = req.body.user_id;
    }

    const updatedProjectUser = await projectUser.save();
    res.status(200).json(updatedProjectUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProjectUser = async (req, res) => {
  try {
    const projectUser = await ProjectUser.findById(req.params.id);
    if (projectUser == null) {
      return res.status(404).json({ message: "Project User not found" });
    }

    await projectUser.remove();
    res.status(200).json({ message: "Deleted Project User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const projectId = req.params.id;
    const projectUsers = await ProjectUser.find({
      project_id: projectId,
    }).populate("user_id");
    const members = projectUsers.map((projectUser) => projectUser.user_id);
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
