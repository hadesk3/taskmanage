import mongoose from "mongoose";
const Schema = mongoose.Schema;

const checklistSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    item_name: { type: String, required: true },
    is_completed: { type: Boolean, default: false}
});

const Checklist = mongoose.model('Checklist', checklistSchema);
export default Checklist;
