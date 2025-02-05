import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectUserSchema = new Schema({
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ProjectUser = mongoose.model("ProjectUser", projectUserSchema);

export default ProjectUser;
