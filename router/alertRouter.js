import express from "express";
import {
    getAllAlerts,
    getAlertById,
    createAlert,
    deleteAlert,
    updateAlert,
    getAlertsByUserId
    
} from "../controller/alertController.js";
const router = express.Router();

router.get('/alerts', getAllAlerts);
router.get('/alerts/:id', getAlertById);
router.post('/alerts', createAlert);
router.put('/alerts/:id', deleteAlert);
router.delete('/alerts/:id', updateAlert);
router.get('/alerts/user/:userId', getAlertsByUserId);

export default router;
