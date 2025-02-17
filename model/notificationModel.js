import mongoose from "mongoose";
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    alert_type: {
        type: String,
        enum: ["Deadline", "Overdue", "Extend"],
        default: "Deadline",
    },
    reason: { type: String },
    date_extend: { type: Date },
    sent_to: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Admin nhận thông báo
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" }, // Người gửi yêu cầu
});

const Alert = mongoose.model("Alert", alertSchema);
export default Alert;
