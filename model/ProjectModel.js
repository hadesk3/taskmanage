import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import the uuidv4 function

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, required: true },
    type: { type: String, required: false },
    lecturers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress",
    },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
