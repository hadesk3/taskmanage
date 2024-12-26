import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';  // Import the uuidv4 function

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    id: { type: String, required: true, unique: true, default: () => uuidv4() },  // Use uuidv4 to generate a unique id

    name: { type: String, required: true },
    description: { type: String, required: false },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, required: true },
    type: { type: String, required: false },
    status: { type: String, enum: ['Planned', 'In Progress', 'Completed'], default: "Planned" }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
