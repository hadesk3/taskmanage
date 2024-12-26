import express from "express";
import {
    getAllChecklists,
    getChecklistById,
    createChecklist,
    deleteChecklist,
    updateChecklist
    
} from "../controller/checkListController.js";
const router = express.Router();

router.get('/checkLists', getAllChecklists);
router.get('/checkLists/:id', getChecklistById);
router.post('/checkLists', createChecklist);
router.put('/checkLists/:id', deleteChecklist);
router.delete('/checkLists/:id', updateChecklist);

export default router;
