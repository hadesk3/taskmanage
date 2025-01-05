import express from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    filterProjectsByStatus,
    searchProjectsByTitle,
    exportProjectsToCSV,
    getProjects
} from "../controller/projectController.js";
const router = express.Router();

router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.get('/projects/search', searchProjectsByTitle); 
router.get('/projects/filter', filterProjectsByStatus);
router.get('/projects/export/csv', exportProjectsToCSV);
router.get("/getProjects", getProjects);

export default router;
