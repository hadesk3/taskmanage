import express from "express";
import {
   getAllProjectUsers,
   getProjectUserById,
   updateProjectUser,
   deleteProjectUser,
   createProjectUser,
   getProjectMembers
   
} from "../controller/projectUserController.js";
const router = express.Router();

router.get('/projectUsers', getAllProjectUsers);
router.get('/projectUsers/:id', getProjectUserById);
router.post('/projectUsers', createProjectUser);
router.put('/projectUsers/:id', updateProjectUser);
router.delete('/projectUsers/:id', deleteProjectUser);
router.get('/projects/:id/members', getProjectMembers);
export default router;
