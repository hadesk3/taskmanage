import mongoose from "mongoose";
const Schema = mongoose.Schema;

const alertSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    alert_type: { type: String, enum: ['Deadline', 'Overdue'], default : 'Deadline'},
    sent_to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now},
    isRead: { type: Boolean, default: false } 
});

const Alert = mongoose.model('Alert', alertSchema);
export default  Alert;
