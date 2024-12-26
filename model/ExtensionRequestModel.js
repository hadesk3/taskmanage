import mongoose from "mongoose";
const Schema = mongoose.Schema;

const extensionRequestSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    new_deadline: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true },
    request_timestamp: { type: Date, required: true }
});

const ExtensionRequest = mongoose.model('ExtensionRequest', extensionRequestSchema);
export default ExtensionRequest;
