import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsersByUsername,
    filterUsersByStatus,
    exportUsersToCSV,
    exportUsersToPDF
} from '../controller/userController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/search', searchUsersByUsername);
router.get('/users/filter', filterUsersByStatus);
router.get('/users/export/csv', exportUsersToCSV); 
router.get('/users/export/pdf', exportUsersToPDF);




export default router;
