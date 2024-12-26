import Checklist from "../model/CheckListModel.js";

// Lấy tất cả checklist
export const getAllChecklists = async (req, res) => {
    try {
        const checklists = await Checklist.find();
        res.status(200).json(checklists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy checklist theo ID
export const getChecklistById = async (req, res) => {
    try {
        const checklist = await Checklist.findById(req.params.id);
        if (!checklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }
        res.status(200).json(checklist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo mới checklist
export const createChecklist = async (req, res) => {
    const checklist = new Checklist({
        task_id: req.body.task_id,
        assigned_to: req.body.assigned_to,
        item_name: req.body.item_name,
        is_completed: req.body.is_completed
    });

    try {
        const newChecklist = await checklist.save();
        res.status(201).json(newChecklist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Cập nhật checklist
export const updateChecklist = async (req, res) => {
    try {
        const updatedChecklist = await Checklist.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedChecklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }
        res.status(200).json(updatedChecklist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa checklist
export const deleteChecklist = async (req, res) => {
    try {
        const deletedChecklist = await Checklist.findByIdAndDelete(req.params.id);
        if (!deletedChecklist) {
            return res.status(404).json({ message: "Checklist not found" });
        }
        res.status(200).json({ message: "Checklist deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
