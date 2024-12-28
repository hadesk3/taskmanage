import express from "express";
import {
   getAllTasks,
   getTaskById,
   createTask,
   updateTask,
   deleteTask,
   searchTasksByTitle,
   filterTasksByStatus,
   exportTasksToCSV,
   exportTasksToPDF,
   getAllTaskAndCheckList,
} from "../controller/taskController.js";
const router = express.Router();

router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks/filter', filterTasksByStatus);
router.get('/tasks/search', searchTasksByTitle);
router.get('/tasks/export/csv', exportTasksToCSV); 
router.get('/tasks/export/pdf', exportTasksToPDF);
router.get('/tasks/getAllTaskAndCheckList/:userId', getAllTaskAndCheckList);

export default router;
