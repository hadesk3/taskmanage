import mongoose from "mongoose";
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: "Task" },
    alert_type: {
        type: String,
        enum: ["Deadline", "Refuse", "Extend", "Assign"],
        default: "Deadline",
    },
    reason: { type: String },
    date_extend: { type: Date },
    sent_to: [{ type: Schema.Types.ObjectId, ref: "User" }],
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    proof: { type: String },
    project_id: { type: Schema.Types.ObjectId, ref: "Project" },
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
