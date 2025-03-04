import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assigned_to: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    title: { type: String, required: true },
    description: { type: String, required: false },
    deadline: { type: Date, required: true },
    checkList: [
        {
            title: { type: String, required: true },
            status: { type: Boolean, default: false },
        },
    ],
    status: {
        type: String,
        enum: [, "In Progress", "Done"],
        default: "In Progress",
    },
    media: {
        type: String,
        default: "",
    },
    proofDone: {
        type: String,
        default: "",
    },
});
const Task = mongoose.model("Task", taskSchema);

export default Task;
