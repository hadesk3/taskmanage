import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';  // Import the uuidv4 function

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id: { type: String, required: true, unique: true, default: () => uuidv4() },  // Use uuidv4 to generate a unique id
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assigned_to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    deadline: { type: Date, required: true },
    status: { type: String, enum: [, 'In Progress', 'Done'], default :"In Progress"}
});
const Task = mongoose.model('Task', taskSchema);

export default Task;
